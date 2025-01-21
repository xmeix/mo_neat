import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";
import BaseError from "../../utils/errors/BaseError.js";
import { ensureRegionsExist, ensureWilayasExist } from "../apis.helpers.js";

export const createShippingZone = async (req, res, next) => {
  try {
    const {
      shippingZoneName,
      carrierName,
      serviceType,
      deliveryFee,
      shippingZoneAddress,
      regions,
      isActive,
      areaType,
    } = req.body;

    // for validation
    // we need to check if the service exists for the same carrierName
    // orelse we output an error message

    const existingService = await prisma.deliveryService.findFirst({
      where: {
        tmCode: serviceType.toUpperCase(),
        carrierName: carrierName.toLowerCase(),
        isActive: true,
      },
    });

    if (!existingService) {
      throw new ValidationError("Delivery method not found, or not active.");
    }

    //we need to check if the wilayas mentionned exist in database orelse we create them
    const wilayaNames = [...new Set(regions.map((item) => item.wilaya))];

    const { wilayaMap, wilayasCreated, wilayasReactivated } =
      await ensureWilayasExist(wilayaNames);

    const { regionsMap, regionsCreated, regionsReactivated } =
      await ensureRegionsExist(regions, wilayaMap);

    // create delivery area
    const newDeliveryAreas = [];
    for (const region of regions) {
      const existingArea = await prisma.deliveryArea.findFirst({
        where: {
          communeId: regionsMap.get(region.postalCode).id,
          name: shippingZoneName,
          deliveryServiceId: existingService.id,
        },
        include: {
          deliveryService: true,
          commune: {
            include: {
              wilaya: true,
            },
          },
        },
      });
      console.log("existingArea");
      console.log(existingArea);

      if (existingArea) {
        throw new BaseError(
          "Validation Error",
          409,
          true,
          `Shipping Zone already exists for ${existingArea.commune.name} -${existingArea.commune.wilaya.name} -${existingArea.commune.postalCode} - ${existingArea.deliveryService.tmCode}`
        );
      } else {
        newDeliveryAreas.push({
          name: shippingZoneName,
          address: shippingZoneAddress ?? "",
          areaType: areaType ?? "",
          isActive: isActive ?? true,
          communeId: regionsMap.get(region.postalCode).id,
          deliveryFee: deliveryFee,
          deliveryServiceId: existingService.id,
        });
      }
    }
    let devAreaCreated = [];
    if (newDeliveryAreas.length > 0) {
      const [_, deliveryAreasCreated] = await prisma.$transaction([
        prisma.deliveryArea.createMany({
          data: newDeliveryAreas,
          skipDuplicates: true,
        }),
        prisma.deliveryArea.findMany({
          where: {
            communeId: { in: newDeliveryAreas.map((area) => area.communeId) },
            deliveryServiceId: existingService.id,
            name: shippingZoneName,
          },
          include: {
            deliveryService: true,
            commune: { include: { wilaya: true } },
          },
        }),
      ]);

      devAreaCreated = deliveryAreasCreated;
      console.log(deliveryAreasCreated);
    }

    res.status(201).json({
      success: true,
      data: {
        shippingZonesCreated: devAreaCreated,
        wilayasCreated,
        wilayasReactivated,
        regionsCreated,
        regionsReactivated,
      },
      message: `Created ${wilayasCreated.length} new wilayas,${regionsCreated.length} new regions,${newDeliveryAreas.length} new shipping zones; reactivated ${wilayasReactivated.length} wilayas and ${regionsReactivated.length} regions`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllShippingZones = async (req, res, next) => {
  try {
    const shippingZones = await prisma.deliveryArea.findMany({
      include: {
        commune: {
          include: {
            wilaya: true,
          },
        },
        deliveryService: true,
      },
    });

    res.status(200).json({
      success: true,
      data: shippingZones,
      message: `shipping zone retrieved successfully .`,
    });
  } catch (error) {
    console.error("Error retrieving shipping zones:", error);
    next(error);
  }
};

export const updateDeliveryArea = async (req, res, next) => {
  try {
    const deliveryAreaId = req.params.id;
    const { name, address, isActive, deliveryFee } = req.body;

    const existingArea = await prisma.deliveryArea.findFirst({
      where: {
        id: parseInt(deliveryAreaId),
      },
      include: {
        deliveryService: true,
        commune: {
          include: {
            wilaya: true,
          },
        },
      },
    });

    if (!existingArea) {
      throw new BaseError(
        "Validation Error",
        404,
        true,
        `Shipping zone does not exist!`
      );
    }

    // If activating the delivery area, ensure related Commune and Wilaya are active
    let communeReactivated = {};
    let wilayaReactivated = {};
    if (isActive) {
      const { commune } = existingArea;
      if (!commune.isActive) {
        communeReactivated = await prisma.commune.update({
          where: { id: commune.id },
          data: { isActive: true },
        });
      }

      if (!commune.wilaya.isActive) {
        wilayaReactivated = await prisma.wilaya.update({
          where: { id: commune.wilaya.id },
          data: { isActive: true },
        });
      }
    }

    const updatedDeliveryArea = await prisma.deliveryArea.update({
      where: { id: parseInt(deliveryAreaId) },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(deliveryFee && { deliveryFee: parseInt(deliveryFee) }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        commune: true,
        deliveryService: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        updatedDeliveryArea,
        communeReactivated,
        wilayaReactivated,
      },
      message: "shipping zone updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteShippingZone = async (req, res, next) => {
  try {
    const deliveryAreaIds = req.body.ids; // Array of delivery area IDs to delete

    const ids = deliveryAreaIds.map((id) => parseInt(id));
    // Find all the delivery services that match the provided IDs
    const deliveryAreas = await prisma.deliveryArea.findMany({
      where: {
        id: { in: ids },
      },
    });

    // If no delivery area are found, return an error
    if (deliveryAreas.length === 0) {
      throw new BaseError(
        "Not Found",
        404,
        true,
        `No shipping zones found with the provided ID(s).`
      );
    }

    // Delete the validated shipping zones
    await prisma.deliveryArea.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    res.status(200).json({
      success: true,
      data: deliveryAreas.map((e) => e.id),
      message: "Shipping zones deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting shipping zones:", error);
    next(error);
  }
};
