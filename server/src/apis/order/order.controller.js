import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany();
    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      orderedBy,
      orderedByPhone,
      address,
      commune,
      wilaya,

      deliveryType,
      chosenStopDeskid,

      orderProducts,
      couponCode,
      shippingCost,
    } = req.body;

    // Validate products and calculate total_before_reduction
    let total_before_reduction = 0;
    for (const orderProduct of orderProducts) {
      const product = await prisma.product.findUnique({
        where: { id: orderProduct.productId },
      });

      if (!product || product.stock < orderProduct.quantity) {
        throw new ValidationError(
          "Product not available or insufficient stock"
        );
      }

      const price = product.onSale
        ? product.price_before_sale * (1 - product.discountPercentage / 100)
        : product.price_before_sale;
      total_before_reduction += price * orderProduct.quantity;
    }

    // Apply coupon if exists
    let total_after_reduction = total_before_reduction;
    let usedCouponId = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon || new Date() > new Date(coupon.expiryDate)) {
        throw new ValidationError("Invalid or expired coupon");
      }

      total_after_reduction -=
        total_before_reduction * (coupon.discountPercentage / 100);
      usedCouponId = coupon.id;
    }

    // Calculate the final checkout price (with shipping)
    const checkoutPrice = total_after_reduction + shippingCost;

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderedBy,
        orderedByPhone,
        address,
        commune,
        wilaya,

        deliveryType,
        chosenStopDeskid,
        OrderCouponid: usedCouponId,
        total_before_reduction,
        total_after_reduction,
        shippingCost,
        checkoutPrice,
        orderProducts: {
          create: orderProducts.map((orderProduct) => ({
            productId: orderProduct.productId,
            quantity: orderProduct.quantity,
            chosenSize: orderProduct.chosenSize,
            chosenColor: orderProduct.chosenColor,
          })),
        },
      },
      include: {
        orderProducts: true,
        chosenStopDesk: true, 
        OrderCoupon: true, 
      },
    });

    return res.status(201).json({
      success: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const ORDERSTATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
};
export const changeOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if the status is valid
    if (!Object.values(ORDERSTATUS).includes(status)) {
      throw new ValidationError(
        `Invalid status! Status must be one of: ${Object.values(
          ORDERSTATUS
        ).join(", ")}`
      );
    }
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order) {
      throw new ValidationError("Order not found!");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
