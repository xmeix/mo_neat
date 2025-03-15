import prisma from "../../db/prismaClient.js";
import BaseError from "../../utils/errors/BaseError.js";
import {
  createCarrier,
  createRelayPoints,
  createZones,
} from "../apis.helpers.js";

export const createDeliveryService = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      carrierName,
      isRelay,
      zones,
      relayPoints,
    } = req.body;

    // check if the delivery service already exists ( code + carrierName )
    const existingService = await prisma.deliveryService.findFirst({
      where: {
        code,
        carrier: {
          name: carrierName,
        },
      },
    });

    if (existingService && existingService.isActive) {
      throw new BaseError(
        "Validation Error",
        409,
        true,
        "Delivery service already exists"
      );
    } else if (existingService && !existingService.isActive) {
      throw new BaseError(
        "Validation Error",
        409,
        true,
        "Delivery service already exists, but inactive, please reactivate it"
      );
    }

    // check if the carrierName exists in the database or create a new one
    const carrier = createCarrier(carrierName);

    // create empty service before adding zones and relay points
    const newDeliveryService = await prisma.deliveryService.create({
      data: {
        name,
        code,
        description,
        carrierId: carrier.id,
      },
    });

    // relay points ==> [{name , address, deliveryFee, communeId,  isActive}]
    // --> creaate delivery service where communeId exists in the database else put them in an array
    // zones ==> [{isActive, deliveryFee, communeId}]
    // --> check if communeId exists in the database or throw an error
    const newPoints = isRelay
      ? createRelayPoints(relayPoints, newDeliveryService.id)
      : createZones(zones, newDeliveryService.id);

    //add new Points to the delivery service
    if (newPoints.length > 0) {
      await prisma.deliveryService.update({
        where: { id: newDeliveryService.id },
        data: {
          //if isRelay is true, add relay points to the delivery service
          ...(isRelay && {
            relayPoints: {
              connect: newPoints.map((point) => ({ id: point.id })),
            },
          }),
          //if isRelay is false, add zones to the delivery service
          ...(isRelay || {
            homeDeliveryZones: {
              connect: newPoints.map((point) => ({ id: point.id })),
            },
          }),
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        relayPoints: isRelay ? newPoints : [],
        zones: isRelay ? [] : newPoints,
        carrier,
        service: newDeliveryService,
      },
      message: "Delivery service updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllDeliveryServices = async (req, res, next) => {
  try {
    //get all delivery services with all their relay points and zones and carrier and communes
    const deliveryServices = await prisma.deliveryService.findMany({
      include: {
        relayPoints: {
          include: {
            commune: true,
          },
        },
        homeDeliveryZones: {
          include: {
            commune: true,
          },
        },
        carrier: true,
      },
    });
    return res.status(200).json({
      success: true,
      data: deliveryServices,
      message: `${deliveryServices.length} Delivery service(s) retrieved successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryService = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the ID from the request
    const {
      name,
      code,
      description,
      carrierName,
      zones,
      relayPoints,
      isActive,
    } = req.body;

    // Find the existing delivery service
    const existingService = await prisma.deliveryService.findUnique({
      where: { id: parseInt(id), carrier: { name: carrierName } },
      include: { carrier: true },
    });

    if (!existingService) {
      throw new BaseError("Not Found", 404, true, "Delivery service not found");
    }

    // Ensure the carrier exists
    const carrier = await createCarrier(carrierName);

    // Update the delivery service
    const updatedService = await prisma.deliveryService.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        code: code || undefined,
        description: description || undefined,
        carrierId: carrier.id,
        isActive: isActive || undefined,
      },
    });

    let newPoints = [];
    if (isRelay) {
      newPoints = await createRelayPoints(relayPoints, updatedService.id);
    } else {
      newPoints = await createZones(zones, updatedService.id);
    }

    // Connect new relay points or zones
    if (newPoints.length > 0) {
      await prisma.deliveryService.update({
        where: { id: updatedService.id },
        data: {
          ...(isRelay && {
            relayPoints: {
              connect: newPoints.map((point) => ({ id: point.id })),
            },
          }),
          ...(!isRelay && {
            homeDeliveryZones: {
              connect: newPoints.map((zone) => ({ id: zone.id })),
            },
          }),
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        relayPoints: isRelay ? newPoints : [],
        zones: !isRelay ? newPoints : [],
        carrier,
        service: updatedService,
      },
      message: `Delivery service ${
        updatedService.name
      } updated successfully with ${
        newPoints.length + isRelay ? "relay points" : "zones"
      }`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteDeliveryService = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // Parse the IDs as integers
    const deliveryServiceIds = ids.map((id) => parseInt(id));

    // Find all the delivery services that match the provided IDs
    const deliveryServices = await prisma.deliveryService.findMany({
      where: {
        id: { in: deliveryServiceIds },
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
        id: { in: deliveryServiceIds },
      },
    });

    return res.status(200).json({
      success: true,
      data: deliveryServiceIds,
      message: `${deliveryServices.length} delivery service(s) deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
