import prisma from "../../db/prismaClient.js";

export const createBatchDelivery = async (req, res, next) => {
  try {
    const body = req.body;

    //first check service existance
    /**
     * - if exists continue
     * - else create new service
     */
    // get and create all missing services
    //get
    const tmCodes = [...new Set(body.map((item) => item.tmCode))];
    const existingServices = await prisma.deliveryService.findMany({
      where: { tmCode: { in: tmCodes } },
    });
    const serviceMap = new Map();
    existingServices.forEach((service) =>
      serviceMap.set(service.tmCode, service)
    );

    //create
    const newServices = [];
    for (const tmCode of tmCodes) {
      if (!serviceMap.has(tmCode)) {
        const newService = await prisma.deliveryService.create({
          data: { tmCode, tmName: tmCode },
        });
        serviceMap.set(tmCode, newService);
        newServices.push(newService);
      }
    }

    //second check wilaya existance
    /**
     * - if exists create commune and delivery area
     * - if it doesn't exist create new wilaya ( create all wilayas before creation of communes )
     */
    //get
    const wilayaNames = [...new Set(body.map((item) => item.wilaya))];
    const existingWilayas = await prisma.wilaya.findMany({
      where: { name: { in: wilayaNames } },
      include: { communes: { include: { deliveryAreas: true } } },
    });

    const wilayaMap = new Map();
    existingWilayas.forEach((wilayaItem) =>
      wilayaMap.set(wilayaItem.name, wilayaItem)
    );

    //create
    const newWilayas = [];
    for (const wilaya of wilayaNames) {
      if (!wilayaMap.has(wilaya)) {
        const createdWilaya = await prisma.wilaya.create({
          data: { name: wilaya },
        });

        const newWilaya = await prisma.wilaya.findUnique({
          where: { id: createdWilaya.id },
          include: {
            communes: {
              include: {
                deliveryAreas: true,
              },
            },
          },
        });

        wilayaMap.set(wilaya, newWilaya);
        newWilayas.push(newWilaya);
      }
    }

    // check communes
    const newCommunes = [];
    const newDeliveryAreas = [];
    const updateDeliveryAreas = [];

    // Process input data
    for (const {
      wilaya,
      commune,
      areaName,
      address,
      postalCode,
      areaType,
      deliveryFee,
      tmCode,
      isActive,
    } of body) {
      const existingWilaya = wilayaMap.get(wilaya);
      const existingService = serviceMap.get(tmCode);
      const existingCommune = existingWilaya.communes.find(
        (commune) => commune.postalCode === parseInt(postalCode)
      );

      if (!existingCommune) {
        newCommunes.push({
          name: commune,
          postalCode: parseInt(postalCode),
          wilayaId: existingWilaya.id,
          deliveryAreas: [
            {
              name: areaName,
              address,
              areaType,
              deliveryFee,
              isActive,
              deliveryServiceId: existingService.id,
            },
          ],
        });
      } else {
        const existingArea = existingCommune.deliveryAreas.find(
          (area) =>
            area.name === areaName &&
            area.deliveryServiceId === existingService.id
        );

        if (!existingArea) {
          newDeliveryAreas.push({
            name: areaName,
            address,
            areaType,
            deliveryFee,
            isActive,
            communeId: existingCommune.id,
            deliveryServiceId: existingService.id,
          });
        } else if (
          existingArea.deliveryFee !== deliveryFee ||
          existingArea.isActive !== isActive
        ) {
          updateDeliveryAreas.push({
            id: existingArea.id,
            deliveryFee,
            isActive,
          });
        }
      }
    }

    if (newCommunes.length > 0) {
      await prisma.commune.createMany({
        data: newCommunes.map(({ name, postalCode, wilayaId }) => ({
          name,
          postalCode: parseInt(postalCode),
          wilayaId,
        })),
        skipDuplicates: true,
      });

      const insertedCommunes = await prisma.commune.findMany({
        where: {
          postalCode: {
            in: newCommunes.map(({ postalCode }) => parseInt(postalCode)),
          },
        },
      });

      // Step 3: Create delivery areas for each commune
      for (const commune of insertedCommunes) {
        const matchingNewCommune = newCommunes.find(
          (nc) => nc.postalCode === commune.postalCode
        );

        if (matchingNewCommune?.deliveryAreas?.length) {
          await prisma.deliveryArea.createMany({
            data: matchingNewCommune.deliveryAreas.map((area) => ({
              ...area,
              communeId: commune.id,
            })),
          });
        }
      }
    }

    // Create new Delivery Areas
    if (newDeliveryAreas.length > 0) {
      await prisma.deliveryArea.createMany({
        data: newDeliveryAreas,
        skipDuplicates: true,
      });
    }

    // Batch update Delivery Areas
    if (updateDeliveryAreas.length > 0) {
      const updateOperations = updateDeliveryAreas
        .filter(({ id }) => id)
        .map(({ id, deliveryFee, isActive }) =>
          prisma.deliveryArea.update({
            where: { id },
            data: { deliveryFee, isActive },
          })
        );
      await prisma.$transaction(updateOperations);
    }

    res.status(201).json({
      success: true,
      message: `Created ${newWilayas.length} new wilayas, ${newCommunes.length} new communes, ${newDeliveryAreas.length} new delivery areas, ${newServices.length} new services and updated ${updateDeliveryAreas.length} delivery areas.`,
    });
  } catch (error) {
    console.error("Error processing batch delivery import:", error);
    next(error);
  }
};



