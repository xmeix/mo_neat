import prisma from "../../db/prismaClient.js";
import AuthorizationError from "../../utils/errors/AuthorizationError.js";
import ValidationError from "../../utils/errors/ValidationError.js";
import { deleteImageFromStorage } from "../../utils/uploadVars.js";
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
        categories: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: products,
      message: "Products retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

const categoriesIdsWCreation = async (categories) => {
  const categoriesPromises = categories.map(async (categoryTitle) => {
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

  return Promise.all(categoriesPromises);
};

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

    const { error } = ProductValidation.validate({
      ...req.body,
      onSale: parseBoolean(onSale),
    });

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const images = req.files.map((file) => "images/" + file.filename);

    // Resolving category IDs or creating new categories
    const categoriesData = await categoriesIdsWCreation(categories);

    // Creating product and including categories in the response
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
        discountPercentage: parseBoolean(onSale)
          ? parseInt(discountPercentage)
          : 0,
        images,
      },
      include: { categories: true },
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
    console.log("here to change");

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
      images: oldImages = [],
    } = req.body;

    //here we have to get the products actual images
    //if the oldImages doesnt include one of them than we delete them
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      select: { images: true },
    });

    if (!existingProduct) {
      throw new ValidationError("Product not found");
    }

    const actualImagesToRemove = existingProduct.images.filter(
      (e) => !oldImages.includes(e)
    );

    const newImages = req.files
      ? req.files.map((file) => "images/" + file.filename)
      : [];

    const updatedImages = existingProduct.images
      .filter((image) => oldImages?.includes(image))
      .concat(newImages);

    const categoriesData = await categoriesIdsWCreation(categories);

    console.log("categoriesData");
    console.log(categoriesData);

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        stock: parseInt(stock),
        onSale: parseBoolean(onSale),
        price_before_sale: parseInt(price_before_sale),
        discountPercentage: parseBoolean(onSale)
          ? parseInt(discountPercentage)
          : 0,
        images: updatedImages,
        categories: {
          connect: categoriesData,
        },
        sizes,
        colors,
      },
      include: { categories: true },
    });

    console.log("product");
    console.log(product);

    actualImagesToRemove.forEach((image) => {
      deleteImageFromStorage(image);
    });

    console.log("dfsldgs");

    return res.status(200).json({
      success: true,
      data: product,
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

    if (!product) {
      throw new ValidationError("Product not found!");
    }

    product.images.forEach((image) => {
      deleteImageFromStorage(image);
    });

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      data: id,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
