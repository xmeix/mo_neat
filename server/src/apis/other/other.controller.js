import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";

export const createWilaya = async (req, res, next) => {
  try {
    const { name, communes, homeDeliveryFee, stopDesks = [] } = req.body;

    console.log(req.body);

    const wilaya = await prisma.wilaya.create({
      data: {
        name,
        communes,
        homeDeliveryFee,
        stopDesks,
      },
      include: {
        stopDesks: true,
      },
    });

    res.status(201).json({
      success: true,
      data: wilaya,
      message: "Wilaya created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWilayas = async (req, res, next) => {
  try {
    const wilayas = await prisma.wilaya.findMany({
      include: {
        StopDesk: true,
      },
    });

    res.status(200).json({
      success: true,
      data: wilayas,
      message: "wilayas retrieved successfully",
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

    await prisma.wilaya.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Wilaya deleted successfully",
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
