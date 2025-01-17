import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";

export const createShippingZone = async (req, res, next) => {
  try {
    const {
      wilaya,
      commune,
      areaName,
      address,
      postalCode,
      areaType,
      deliveryFee,
      isActive,
      tmCode,
    } = req.body;

    const existingService = await prisma.deliveryService.findUnique({
      where: { tmCode: tmCode },
    });

    if (!existingService) {
      existingService = await prisma.deliveryService.create({
        data: { tmCode, tmName: tmCode },
      });
    }

    const existingWilaya = await prisma.wilaya.findUnique({
      where: { name: wilaya },
      include: { communes: { include: { deliveryAreas: true } } },
    });

    if (!existingWilaya) {
      const createdWilaya = await prisma.wilaya.create({
        data: { name: wilaya },
      });
      existingWilaya = await prisma.wilaya.findUnique({
        where: { id: createdWilaya.id },
        include: {
          communes: {
            include: {
              deliveryAreas: true,
            },
          },
        },
      });
    }

    const existingCommune = existingWilaya.communes.find(
      (commune) => commune.postalCode === parseInt(postalCode)
    );

    let existingArea = null;

    if (!existingCommune) {
      existingCommune = await prisma.commune.create({
        data: {
          name: commune,
          postalCode: parseInt(postalCode),
          wilayaId: existingWilaya.id,
          deliveryAreas: {
            create: [
              {
                name: areaName,
                address,
                areaType,
                deliveryFee,
                isActive,
                deliveryServiceId: existingService.id,
              },
            ],
          },
        },
        include: {
          deliveryAreas: true,
        },
      });
    } else {
      existingArea = existingCommune.deliveryAreas.find(
        (area) =>
          area.name === areaName &&
          area.deliveryServiceId === existingService.id
      );

      if (!existingArea) {
        existingArea = await prisma.deliveryArea.create({
          data: {
            name: areaName,
            address,
            areaType,
            deliveryFee,
            isActive,
            communeId: existingCommune.id,
            deliveryServiceId: existingService.id,
          },
        });
      } else {
        return res.status(200).json({
          success: true,
          data: wilaya,
          message: "Shipping zone exists already.",
        });
      }
    }

    res.status(201).json({
      success: true,
      data: existingArea,
      message: `${areaName} added successfully .`,
    });
  } catch (error) {
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
        orders: {
          include: {
            orderProducts: {
              include: {
                product: true,
              },
            },
          },
        },
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
    const {
      deliveryServiceId,
      tmCode,
      tmName,
      wilayaId,
      wilayaName,
      communeId,
      communeName,
      postalCode,
      areaName,
      address,
      areaType,
      deliveryFee,
      isActive,
      tmIsActive,
      tmDescription,
    } = req.body;

    // Update Delivery Service
    let updatedDeliveryService = null;
    if (
      deliveryServiceId &&
      (tmCode || tmName || tmDescription || tmIsActive)
    ) {
      updatedDeliveryService = await prisma.deliveryService.update({
        where: { id: deliveryServiceId },
        data: {
          ...(tmCode && { tmCode }),
          ...(tmName && { tmName }),
          ...(tmDescription && { tmDescription }),
          ...(tmIsActive && { tmIsActive }),
        },
      });
    }

    // Update Wilaya
    let updatedWilaya = null;
    if (wilayaId && wilayaName) {
      updatedWilaya = await prisma.wilaya.update({
        where: { id: wilayaId },
        data: { name: wilayaName },
      });
    }

    // Update Commune
    let updatedCommune = null;
    if (communeId && (communeName || postalCode)) {
      updatedCommune = await prisma.commune.update({
        where: { id: communeId },
        data: {
          ...(communeName && { name: communeName }),
          ...(postalCode && { postalCode: parseInt(postalCode) }),
        },
      });
    }

    // Update Delivery Area
    let updatedDeliveryArea = null;
    if (
      deliveryAreaId &&
      (areaName || address || areaType || deliveryFee || isActive !== undefined)
    ) {
      updatedDeliveryArea = await prisma.deliveryArea.update({
        where: { id: deliveryAreaId },
        data: {
          ...(areaName && { name: areaName }),
          ...(address && { address }),
          ...(areaType && { areaType }),
          ...(deliveryFee && { deliveryFee: parseInt(deliveryFee) }),
          ...(isActive !== undefined && { isActive }),
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        deliveryService: updatedDeliveryService,
        wilaya: updatedWilaya,
        commune: updatedCommune,
        deliveryArea: updatedDeliveryArea,
      },
      message: "Delivery system updated successfully.",
    });
  } catch (error) {
    console.error("Error updating delivery system:", error);
    next(error);
  }
};

export const deleteShippingZone = async (req, res, next) => {
  try {
  } catch (error) {
    console.error("Error deleting shipping zone:", error);
    next(error);
  }
};
