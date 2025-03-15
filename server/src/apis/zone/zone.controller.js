import { $Enums } from "@prisma/client";
import prisma from "../../db/prismaClient.js";
import BaseError from "../../utils/errors/BaseError.js";

export const createOrUpdateZone = async (req, res, next) => {
  try {
    const { deliveryFee, communeId, serviceId, isActive } = req.body;

    const zone = await prisma.homeDeliveryZone.upsert({
      where: {
        communeId,
        serviceId,
      },
      update: {
        deliveryFee: deliveryFee || undefined,
        isActive: isActive || undefined,
      },
      create: {
        deliveryFee,
        commune: { connect: { id: communeId } },
        service: { connect: { id: serviceId } },
      },
      include: { service: true, commune: true },
    });

    res.status(201).json({
      success: true,
      data: zone,
      message: `done`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllZones = async (req, res, next) => {
  try {
    const zones = await prisma.homeDeliveryZone.findMany({
      include: {
        commune: {
          include: {
            wilaya: true,
          },
        },
        service: true,
      },
    });

    res.status(200).json({
      success: true,
      data: zones,
      message: `home delivery zones retrieved successfully .`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteAllZones = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // Parse the IDs as integers
    const zoneIds = ids.map((id) => parseInt(id));

    // Find all the delivery services that match the provided IDs
    const zones = await prisma.homeDeliveryZone.findMany({
      where: {
        id: { in: zoneIds },
      },
    });

    // If no delivery services are found, return an error
    if (zones.length === 0) {
      throw new BaseError(
        "Not Found",
        404,
        true,
        `No zones found with the provided ID(s).`
      );
    }

    // Delete the delivery services
    await prisma.homeDeliveryZone.deleteMany({
      where: {
        id: { in: zoneIds },
      },
    });

    return res.status(200).json({
      success: true,
      data: zoneIds,
      message: `${zones.length} zone(s) deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createOrUpdateRelay = async (req, res, next) => {
  try {
    const { name, address, deliveryFee, communeId, serviceId, isActive } =
      req.body;

    const relayPoint = await prisma.homeDeliveryZone.upsert({
      where: {
        communeId,
        serviceId,
      },
      update: {
        name: name || undefined,
        address: address || undefined,
        deliveryFee: deliveryFee || undefined,
        isActive: isActive || undefined,
      },
      create: {
        deliveryFee,
        name,
        address,
        commune: { connect: { id: communeId } },
        service: { connect: { id: serviceId } },
      },
      include: { service: true, commune: true },
    });

    res.status(201).json({
      success: true,
      data: relayPoint,
      message: `done`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllRelayPoints = async (req, res, next) => {
  try {
    const relayPoints = await prisma.relayPoint.findMany({
      include: {
        commune: {
          include: {
            wilaya: true,
          },
        },
        service: true,
      },
    });

    res.status(200).json({
      success: true,
      data: relayPoints,
      message: `relay points retrieved successfully.`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const deleteAllRelayPoints = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // Parse the IDs as integers
    const relayPointIds = ids.map((id) => parseInt(id));

    // Find all the delivery services that match the provided IDs
    const relayPoints = await prisma.relayPoint.findMany({
      where: {
        id: { in: relayPointIds },
      },
    });

    // If no delivery services are found, return an error
    if (relayPoints.length === 0) {
      throw new BaseError(
        "Not Found",
        404,
        true,
        `No relay points found with the provided ID(s).`
      );
    }

    // Delete the delivery services
    await prisma.relayPoint.deleteMany({
      where: {
        id: { in: relayPointIds },
      },
    });

    return res.status(200).json({
      success: true,
      data: relayPointIds,
      message: `${relayPoints.length} relay point(s) deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
