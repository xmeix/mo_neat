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
      images: oldImages = [], // Images to retain
      enabled,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      select: { images: true, categories: true },
    });

    if (!existingProduct) {
      throw new ValidationError("Product not found");
    }

    console.log("Existing Images:", existingProduct.images);
    console.log("Old Images (to retain):", oldImages);

    // Check if the product images need to be removed
    const actualImagesToRemove =
      oldImages.length > 0
        ? existingProduct.images.filter((image) => !oldImages.includes(image))
        : [];

    console.log("Images to Remove:", actualImagesToRemove);

    // Get the new images (uploaded files)
    const newImages = req.files
      ? req.files.map((file) => "images/" + file.filename)
      : [];

    console.log("New Images:", newImages);

    // Combine existing retained images with new uploaded images
    const updatedImages = [
      ...(oldImages.length > 0
        ? existingProduct.images.filter((image) => oldImages.includes(image))
        : existingProduct.images),
      ...newImages,
    ];

    console.log("Updated Images:", updatedImages);

    const categoriesData = categories
      ? await categoriesIdsWCreation(categories)
      : [];

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(price_before_sale && {
        price_before_sale: parseInt(price_before_sale),
      }),
      ...(onSale !== undefined && { onSale: parseBoolean(onSale) }),
      ...(enabled !== undefined && { enabled }),
      ...(stock && { stock: parseInt(stock) }),
      ...(discountPercentage && {
        discountPercentage: parseInt(discountPercentage),
      }),
      ...(categoriesData.length > 0 && {
        categories: { connect: categoriesData },
      }),
      ...(sizes && { sizes }),
      ...(colors && { colors }),
      images: updatedImages, // Ensure this is always included
    };

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { categories: true },
    });

    // Delete old images that are no longer part of the product
    actualImagesToRemove.forEach((image) => {
      deleteImageFromStorage(image);
    });

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
      throw new BaseError("Validation Error", 404, true, `Product not found!`);
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
