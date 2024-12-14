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

export const getAllCommunes = async (req, res, next) => {
  try {
    const communes = await prisma.commune.findMany({
      include: {
        wilaya: true,
      },
    });

    const result = communes.map((commune) => ({
      id: commune.id,
      name: commune.name,
      wilaya: commune.wilaya.name,
      createdAt: commune.createdAt,
      updatedAt: commune.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: result,
      message: "Communes retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const createCommune = async (req, res, next) => {
  try {
    const { name, wilaya: wilayaName, homeDeliveryFee } = req.body;

    let wilaya = await prisma.wilaya.findUnique({
      where: { name: wilayaName },
    });

    if (!wilaya) {
      wilaya = await prisma.wilaya.create({
        data: {
          name: wilayaName,
          homeDeliveryFee: parseInt(homeDeliveryFee) || 0,
          communes: {
            create: {
              name,
            },
          },
        },
        include: {
          communes: true,
        },
      });
    } else {
      await prisma.commune.create({
        data: {
          name,
          wilaya: {
            connect: { id: wilaya.id },
          },
        },
      });
    }

    const communes = await prisma.commune.findMany({
      where: { wilayaId: wilaya.id },
      include: {
        wilaya: true,
      },
    });

    const result = communes.map((commune) => ({
      id: commune.id,
      name: commune.name,
      wilaya: commune.wilaya.name,
      createdAt: commune.createdAt,
      updatedAt: commune.updatedAt,
    }));

    res.status(201).json({
      success: true,
      data: result,
      message: "Commune created successfully and attached to the wilaya.",
    });
  } catch (error) {
    next(error);
  }
};

export const getWilayaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: parseInt(id) },
      include: {
        StopDesk: true,
      },
    });

    if (!wilaya) {
      throw new ValidationError("Wilaya not found");
    }

    res.status(200).json({
      success: true,
      data: wilaya,
      message: "wilaya retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addCommunesToWilaya = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { communes } = req.body;

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: parseInt(id) },
    });

    if (!wilaya) {
      throw new ValidationError("Wilaya not found");
    }

    const newCommunes = communes.filter(
      (commune) => !wilaya.communes.includes(commune)
    );

    if (newCommunes.length === 0) {
      return res.status(200).json({
        success: true,
        data: wilaya,
        message: "No new communes to add",
      });
    }

    const updatedWilaya = await prisma.wilaya.update({
      where: { id: parseInt(id) },
      data: {
        communes: {
          push: newCommunes,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedWilaya,
      message: "Communes added successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const createStopDesk = async (req, res, next) => {
  try {
    const { wilayaId } = req.params;
    const { name, address, stopDeskDeliveryFees } = req.body;

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: parseInt(wilayaId) },
    });

    if (!wilaya) {
      throw new ValidationError("Wilaya not found");
    }

    // Check if StopDesk with the same name exists in the wilaya
    const existingStopDesk = await prisma.stopDesk.findFirst({
      where: {
        name,
        wilayaId: parseInt(wilayaId),
      },
    });

    if (existingStopDesk) {
      throw new ValidationError(
        "StopDesk with this name already exists in the specified Wilaya"
      );
    }

    // Create new StopDesk
    const stopDesk = await prisma.stopDesk.create({
      data: {
        name,
        address,
        stopDeskDeliveryFees,
        wilayaId: parseInt(wilayaId),
      },
    });

    res.status(201).json({
      success: true,
      data: stopDesk,
      message: "StopDesk created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStopDesksByWilaya = async (req, res, next) => {
  try {
    const { wilayaId } = req.params;

    const stopDesks = await prisma.stopDesk.findMany({
      where: { wilayaId: parseInt(wilayaId) },
    });

    res.status(200).json({
      success: true,
      data: stopDesks,
    });
  } catch (error) {
    next(error);
  }
};
export const updateStopDesk = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, StopDeskDeliveryFees } = req.body;

    const stopDesk = await prisma.stopDesk.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        StopDeskDeliveryFees,
      },
    });

    res.status(200).json({
      success: true,
      data: stopDesk,
      message: "StopDesk updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStopDesk = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.stopDesk.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "StopDesk deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const deleteCommuneFromWilaya = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commune } = req.body;

    const wilaya = await prisma.wilaya.findUnique({
      where: { id: parseInt(id) },
    });

    if (!wilaya) {
      throw new ValidationError("Wilaya not found");
    }

    if (!wilaya.communes.includes(commune)) {
      throw new ValidationError("Commune not found in this Wilaya");
    }

    const updatedWilaya = await prisma.wilaya.update({
      where: { id: parseInt(id) },
      data: {
        communes: {
          set: wilaya.communes.filter((c) => c !== commune),
        },
      },
    });

    res.status(200).json({
      success: true,
      data: updatedWilaya,
      message: "Commune deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
