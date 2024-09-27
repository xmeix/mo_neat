import prisma from "../../db/prismaClient.js";
import AuthorizationError from "../../utils/errors/AuthorizationError.js";
import ValidationError from "../../utils/errors/ValidationError.js";
import { ProductValidation } from "../../validation/product.validation.js";
const parseBoolean = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return !!value;
};
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true, // This includes the related categories
      },
    });

    // Transform products to only include category titles
    const transformedProducts = products.map((product) => ({
      ...product,
      categories: product.categories.map((category) => category.title), // Extract the titles
    }));

    return res.status(200).json({
      success: true,
      data: transformedProducts,
      message: "Products retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

const categoriesIdsWCreation = (categories) => {
  return categories?.map(async (categoryTitle) => {
    let category = await prisma.category.findUnique({
      where: { title: categoryTitle },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { title: categoryTitle },
      });
    }

    return { id: category.id };
  });
};

//add product to a certain category and if theres no category it creates a new one
export const addProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      stock,
      categories,
      sizes,
      colors,
      onSale,
      price_before_sale,
      discountPercentage,
    } = req.body;
    //validation
    console.log(req.body);
    const { error } = ProductValidation.validate({
      ...req.body,
      onSale: parseBoolean(onSale),
    });

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    console.log(req.files);

    const images = req.files.map((file) => "images/" + file.filename);

    const categoriesData = await Promise.all(
      categoriesIdsWCreation(categories)
    );

    const product = await prisma.product.create({
      data: {
        title,
        description,
        categories: {
          connect: categoriesData,
        },
        sizes,
        colors,
        stock: parseInt(stock),
        onSale: parseBoolean(onSale),
        price_before_sale: parseInt(price_before_sale),
        discountPercentage: parseInt(discountPercentage) || 0,
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
      stock,
      discountPercentage,
      categories,
      sizes,
      colors,
    } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : undefined;

    const categoriesData = await Promise.all(
      categoriesIdsWCreation(categories)
    );

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
        stock,
        categories: {
          connect: categoriesData,
        },
        sizes,
        colors,
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

    console.log("deleting this id " + id);
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    console.log("product");
    console.log(product);

    if (!product) {
      throw new ValidationError("Product not found!");
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    console.log("product deleted");

    return res.status(200).json({
      success: true,
      data: null,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
