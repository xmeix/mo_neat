import prisma from "../../db/prismaClient.js";
import AuthorizationError from "../../utils/errors/AuthorizationError.js";
import ValidationError from "../../utils/errors/ValidationError.js";
const parseBoolean = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return !!value;
};
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json({
      success: true,
      data: products,
      message: "Products retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      stock,
      onSale,
      price_before_sale,
      discountPercentage,
    } = req.body;

    const images = req.files.map((file) => file.path);
    const product = await prisma.product.create({
      data: {
        title,
        description,
        stock: parseInt(stock),
        onSale: parseBoolean(onSale),
        price_before_sale: parseInt(price_before_sale),
        discountPercentage: parseInt(discountPercentage),

        images,
      },
    });

    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price_before_sale,
      onSale,
      discountPercentage,
    } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : undefined;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      throw new ValidationError("Product not found!");
    }
    if (!req.user.isAdmin) {
      throw new AuthorizationError(
        "You do not have permission to update this product!"
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        images,
        price_before_sale,
        onSale,
        discountPercentage,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      throw new ValidationError("Product not found!");
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const rateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      throw new ValidationError("Product not found!");
    }
    if (!req.user.isAdmin) {
      throw new AuthorizationError(
        "You do not have permission to update this product!"
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        rating,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Thank you for rating!",
    });
  } catch (error) {
    next(error);
  }
};
