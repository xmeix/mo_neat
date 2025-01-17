import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";

export const createWilaya = async (req, res, next) => {
  try {
    const { name, communes, homeDeliveryFee, stopDesks = [] } = req.body;

    const existingCommunes = await prisma.commune.findMany({
      where: {
        name: {
          in: communes,
        },
      },
      select: {
        name: true,
      },
    });

    const existingCommuneNames = existingCommunes.map(
      (commune) => commune.name
    );

    const communesToCreate = communes.filter(
      (commune) => !existingCommuneNames.includes(commune)
    );

    const wilaya = await prisma.wilaya.create({
      data: {
        name,
        homeDeliveryFee: parseInt(homeDeliveryFee),
        communes: {
          create: communesToCreate.map((commune) => ({
            name: commune,
          })),
        },
        stopDesks: {
          create: stopDesks.map((desk) => ({
            name: desk.name,
            address: desk.address,
            StopDeskDeliveryFees: parseInt(desk.StopDeskDeliveryFees),
          })),
        },
      },
      include: {
        stopDesks: true,
        communes: true,
      },
    });

    const result = {
      id: wilaya.id,
      name: wilaya.name,
      homeDeliveryFee: parseInt(wilaya.homeDeliveryFee),
      stopDesks: wilaya.stopDesks,
      communes: wilaya.communes,
      createdAt: wilaya.createdAt,
      updatedAt: wilaya.updatedAt,
    };

    res.status(201).json({
      success: true,
      data: result,
      message: "Wilaya created successfully",
    });
  } catch (error) {
    console.error("Error creating wilaya:", error);
    next(error);
  }
};

export const getAllWilayas = async (req, res, next) => {
  try {
    const wilayas = await prisma.wilaya.findMany({
      include: {
        stopDesks: true,
        communes: true,
      },
    });

    const result = wilayas.map((wilaya) => ({
      id: wilaya.id,
      name: wilaya.name,
      homeDeliveryFee: parseInt(wilaya.homeDeliveryFee),
      createdAt: wilaya.createdAt,
      updatedAt: wilaya.updatedAt,
      stopDesks: wilaya.stopDesks,
      communes: wilaya.communes.map((commune) => commune.name),
      createdAt: wilaya.createdAt,
      updatedAt: wilaya.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: result,
      message: "Wilayas retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const updateWilaya = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, communes, homeDeliveryFee } = req.body;

    const updatedWilaya = await prisma.wilaya.update({
      where: { id: parseInt(id) },
      data: {
        name,
        communes,
        homeDeliveryFee,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedWilaya,
      message: "Wilaya updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWilaya = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedWilaya = await prisma.wilaya.delete({
      where: { id: parseInt(id) },
      include: {
        communes: true,
        stopDesks: true,
      },
    });

    res.status(200).json({
      success: true,
      data: deletedWilaya,
      message: "Wilaya and related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting wilaya:", error);
    next(error);
  }
};
