import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";

export const createBatchHomeDelivery = async (req, res, next) => {
  try {
    const body = req.body;

    // Extract unique Wilaya names
    const wilayaNames = [...new Set(body.map((item) => item.wilaya))];

    // Fetch existing Wilayas and Communes
    const existingWilayas = await prisma.wilaya.findMany({
      where: { name: { in: wilayaNames } },
      include: { communes: true },
    });

    // Map for quick lookup
    const wilayaMap = new Map();
    for (const wilaya of existingWilayas) {
      wilayaMap.set(wilaya.name, wilaya);
    }

    const newWilayas = [];
    const newCommunes = [];
    const updateCommunes = [];

    for (const { wilaya, commune, deliveryFee } of body) {
      const existingWilaya = wilayaMap.get(wilaya);

      if (!existingWilaya) {
        // Queue Wilaya for creation
        newWilayas.push({ name: wilaya });
      } else {
        const existingCommune = existingWilaya.communes.find(
          (c) => c.name === commune
        );

        if (!existingCommune) {
          // Queue Commune for creation
          newCommunes.push({
            name: commune,
            wilayaId: existingWilaya.id,
            homeDeliveryFee: deliveryFee,
          });
        } else if (existingCommune.homeDeliveryFee !== deliveryFee) {
          // Queue Commune for update
          updateCommunes.push({
            id: existingCommune.id,
            homeDeliveryFee: deliveryFee,
          });
        }
      }
    }

    // Create new Wilayas
    if (newWilayas.length > 0) {
      await prisma.wilaya.createMany({
        data: newWilayas,
        skipDuplicates: true,
      });
    }

    // Refresh Wilaya map after insertion
    const updatedWilayas = await prisma.wilaya.findMany({
      where: { name: { in: wilayaNames } },
    });
    for (const wilaya of updatedWilayas) {
      wilayaMap.set(wilaya.name, wilaya);
    }

    // Assign Wilaya IDs to new Communes
    for (const { wilaya, commune, deliveryFee } of body) {
      if (!wilayaMap.get(wilaya)) continue;
      const wilayaId = wilayaMap.get(wilaya).id;
      newCommunes.push({
        name: commune,
        wilayaId,
        homeDeliveryFee: deliveryFee,
      });
    }

    // Batch create new Communes
    if (newCommunes.length > 0) {
      await prisma.commune.createMany({
        data: newCommunes,
        skipDuplicates: true,
      });
    }

    // Batch update Communes
    if (updateCommunes.length > 0) {
      const updateOperations = updateCommunes.map(({ id, homeDeliveryFee }) =>
        prisma.commune.update({
          where: { id },
          data: { homeDeliveryFee },
        })
      );
      await prisma.$transaction(updateOperations);
    }

    res.status(201).json({
      success: true,
      message: "Batch home delivery entries created/updated successfully.",
    });
  } catch (error) {
    console.error("Error processing batch home delivery:", error);
    next(error);
  }
};

export const createBatchStopDesks = async (req, res, next) => {
  try {
    const body = req.body;

    // Get all unique Wilaya names from the input
    const wilayaNames = [...new Set(body.map((item) => item.wilaya))];

    // Fetch existing Wilayas and their StopDesks
    const existingWilayas = await prisma.wilaya.findMany({
      where: { name: { in: wilayaNames } },
      include: { stopDesks: true },
    });

    // Create a lookup map for quick access
    const wilayaMap = new Map();
    for (const wilaya of existingWilayas) {
      wilayaMap.set(wilaya.name, wilaya);
    }

    const newWilayas = [];
    const newStopDesks = [];
    const updateStopDesks = [];

    for (const { wilaya, stopDesk, address, deliveryFee } of body) {
      const existingWilaya = wilayaMap.get(wilaya);

      if (!existingWilaya) {
        // If Wilaya doesn't exist, create it with the first StopDesk
        newWilayas.push({
          name: wilaya,
          stopDesks: {
            create: [
              { name: stopDesk, address, StopDeskDeliveryFees: deliveryFee },
            ],
          },
        });
      } else {
        // Wilaya exists; check for the StopDesk
        const existingStopDesk = existingWilaya.stopDesks.find(
          (s) => s.name === stopDesk
        );

        if (!existingStopDesk) {
          // If the StopDesk doesn't exist, queue it for creation
          newStopDesks.push({
            name: stopDesk,
            address,
            wilayaId: existingWilaya.id,
            StopDeskDeliveryFees: deliveryFee,
          });
        } else if (
          existingStopDesk.StopDeskDeliveryFees !== deliveryFee ||
          existingStopDesk.address !== address
        ) {
          // If the deliveryFee or address differs, queue it for update
          updateStopDesks.push({
            id: existingStopDesk.id,
            data: { address, StopDeskDeliveryFees: deliveryFee },
          });
        }
      }
    }

    // Batch create new Wilayas
    if (newWilayas.length > 0) {
      await prisma.wilaya.createMany({
        data: newWilayas,
        skipDuplicates: true,
      });
    }

    // Batch create new StopDesks
    if (newStopDesks.length > 0) {
      await prisma.stopDesk.createMany({
        data: newStopDesks,
        skipDuplicates: true,
      });
    }

    // Batch update StopDesks
    if (updateStopDesks.length > 0) {
      const updateOperations = updateStopDesks.map(({ id, data }) =>
        prisma.stopDesk.update({
          where: { id },
          data,
        })
      );

      await prisma.$transaction(updateOperations);
    }

    res.status(201).json({
      success: true,
      message: "Batch stop desk entries created/updated successfully.",
    });
  } catch (error) {
    console.error("Error processing batch stop desks:", error);
    next(error);
  }
};

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
