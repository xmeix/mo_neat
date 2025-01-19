import prisma from "../../db/prismaClient.js";
import BaseError from "../../utils/errors/BaseError.js";
import { DeliveryServiceValidation } from "../../validation/deliveryService.validation.js";

export const createDeliveryService = async (req, res, next) => {
  try {
    const { tmCode, tmName, tmDescription, carrierName, isActive } = req.body;

    const { error } = DeliveryServiceValidation.validate(req.body);

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Validate service existence
    const existingService = await prisma.deliveryService.findFirst({
      where: { tmCode, carrierName },
    });

    if (existingService) {
      throw new BaseError(
        "Validation Error",
        409,
        true,
        "Delivery service already exists"
      );
    }

    // Create new delivery service
    const newDeliveryService = await prisma.deliveryService.create({
      data: {
        tmCode: tmCode.toUpperCase(),
        tmName: tmName.toLowerCase(),
        tmDescription: tmDescription.toLowerCase(),
        carrierName: carrierName.toLowerCase(),
        isActive,
      },
    });

    res.status(201).json({
      success: true,
      data: newDeliveryService,
      message: "Delivery method created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDeliveryServices = async (req, res, next) => {
  try {
    const deliveryServices = await prisma.deliveryService.findMany();
    return res.status(200).json({
      success: true,
      data: deliveryServices,
      message: "Delivery Services retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tmCode, tmName, tmDescription, isActive, carrierName } = req.body;

    const deliveryServiceId = parseInt(id, 10);

    // Check if the delivery service exists
    const existingDeliveryService = await prisma.deliveryService.findFirst({
      where: { id: deliveryServiceId },
    });

    if (!existingDeliveryService) {
      throw new BaseError(
        "Validation Error",
        404,
        true,
        `Delivery service does not exist!`
      );
    }

    if (tmCode || carrierName) {
      // Check if another delivery service exists with the same tmCode and carrierName
      const conflictingDeliveryService = await prisma.deliveryService.findFirst(
        {
          where: {
            tmCode: tmCode ?? existingDeliveryService.tmCode,
            carrierName: carrierName ?? existingDeliveryService.carrierName,
            NOT: { id: deliveryServiceId },
          },
        }
      );

      if (conflictingDeliveryService) {
        throw new BaseError(
          "Validation Error",
          409,
          true,
          `Delivery service already exists for carrier '${conflictingDeliveryService.carrierName}' and tmCode '${conflictingDeliveryService.tmCode}'`
        );
      }
    }

    // Prepare the data for updating
    const dataToUpdate = {
      ...(tmCode && { tmCode }),
      ...(tmName && { tmName }),
      ...(tmDescription && { tmDescription }),
      ...(isActive !== undefined && { isActive }),
      ...(carrierName && { carrierName }),
    };

    // Update the delivery service
    const updatedDeliveryService = await prisma.deliveryService.update({
      where: { id: deliveryServiceId },
      data: dataToUpdate,
      include: {
        deliveryAreas: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedDeliveryService,
      message: "Delivery service updated successfully",
    });
  } catch (error) {
    next(error); // Forward the error to the error handler middleware
  }
};

export const deleteDeliveryService = async (req, res, next) => {
  try {
    const idArray = req.body; // body is an array of delivery services ids

    // Parse the IDs as integers
    const ids = idArray.map((id) => parseInt(id));

    // Find all the delivery services that match the provided IDs
    const deliveryServices = await prisma.deliveryService.findMany({
      where: {
        id: { in: ids },
      },
    });

    // If no delivery services are found, return an error
    if (deliveryServices.length === 0) {
      throw new BaseError(
        "Not Found",
        404,
        true,
        `No delivery services found with the provided ID(s).`
      );
    }

    // Delete the delivery services
    await prisma.deliveryService.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return res.status(200).json({
      success: true,
      data: ids,
      message: `${deliveryServices.length} delivery service(s) deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
