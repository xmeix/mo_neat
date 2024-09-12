import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany();
    return res.status(200).json({
      success: true,
      data: coupons,
      message: "Coupons retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, name, discountPercentage, description, expiryDate } =
      req.body;

    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code },
    });

    if (existingCoupon) {
      throw new ValidationError("Coupon code already exists.");
    }

    // Create a new coupon
    const coupon = await prisma.coupon.create({
      data: {
        code,
        name,
        discountPercentage,
        description,
        expiryDate: new Date(expiryDate),
      },
    });

    return res.status(201).json({
      success: true,
      data: coupon,
      message: "Coupon created successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(id) },
    });

    if (!coupon) {
      throw new ValidationError("coupon not found!");
    }

    await prisma.coupon.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: "coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
