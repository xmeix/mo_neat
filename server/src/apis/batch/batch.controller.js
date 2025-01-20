import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";
import {
  ensureRegionsExist,
  ensureWilayasExist,
  groupBy,
} from "../apis.helpers.js";

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

export const createSzsBatch = async (req, res, next) => {
  try {
    const shippingZones = req.body;

    // check services first
    const { allZonesHaveMatch, existingServices } =
      await ensureServiceRegionMatch(shippingZones);
    console.log("allZonesHaveMatch");
    console.log(allZonesHaveMatch);
    if (!allZonesHaveMatch) {
      throw new ValidationError(
        "Not all shipping zones have matching active delivery services."
      );
    }

    //we need to check if the wilayas mentionned exist in database orelse we create them
    const wilayaNames = [...new Set(shippingZones.map((item) => item.wilaya))];
    const { wilayaMap, wilayasCreated, wilayasReactivated } =
      await ensureWilayasExist(wilayaNames);

    const regions = shippingZones.map((el) => ({
      commune: el.commune,
      wilaya: el.wilaya,
      postalCode: parseInt(el.postalCode),
    }));

    const { regionsMap, regionsCreated, regionsReactivated } =
      await ensureRegionsExist(regions, wilayaMap);

    const whereConditionsForCreation = await getNonExistantAreaWhereConditions(
      regions,
      regionsMap,
      shippingZones,
      existingServices
    );
    console.log("whereConditionsForCreation");
    console.log(whereConditionsForCreation);
    let newDeliveryAreas = [];
    // Create areas that don't exist
    if (whereConditionsForCreation.length > 0) {
      newDeliveryAreas = await Promise.all(
        whereConditionsForCreation.map(async (data) =>
          prisma.deliveryArea.create({
            data,
            include: {
              commune: true,
              deliveryService: true,
            },
          })
        )
      );
    } else {
      throw new ValidationError(
        "All areas already exist or there were no areas to create."
      );
    }

    res.status(201).json({
      success: true,
      data: newDeliveryAreas,
      message: `Created ${wilayasCreated.length} new wilayas,${regionsCreated.length} new regions,${newDeliveryAreas.length} new shipping zones; reactivated ${wilayasReactivated.length} wilayas and ${regionsReactivated.length} regions`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getNonExistantAreaWhereConditions = async (
  regions,
  regionsMap,
  shippingZones,
  existingServices
) => {
  const SZMap = groupBy(
    shippingZones,
    (el) => `${el.commune}-${el.wilaya}-${el.postalCode}`
  );
  const ServicesMap = groupBy(existingServices, (s) => s.tmCode);

  const whereConditionsForCreation = [];

  // Iterate over regions
  await Promise.all(
    regions.map(async (region) => {
      const regSZs =
        SZMap[`${region.commune}-${region.wilaya}-${region.postalCode}`];

      // Process shipping zones for the region
      await Promise.all(
        regSZs.map(async (shippingZone) => {
          const areaData = {
            name: shippingZone.areaName,
            address: shippingZone.address ?? "",
            areaType: shippingZone.areaType ?? "",
            isActive: shippingZone.isActive ?? true,
            communeId: regionsMap.get(region.postalCode)?.id,
            deliveryFee: parseInt(shippingZone.deliveryFee), // Ensure base-10 parsing
            deliveryServiceId: ServicesMap[shippingZone.tmCode]?.[0]?.id,
          };

          // Check for existing area
          const existingArea = await prisma.deliveryArea.findFirst({
            where: {
              name: areaData.name,
              communeId: areaData.communeId,
              deliveryServiceId: areaData.deliveryServiceId,
            },
          });

          if (!existingArea) {
            whereConditionsForCreation.push(areaData);
          }
        })
      );
    })
  );

  return whereConditionsForCreation;
};

//check if each tm code with carrier name --- exists on the service table
const ensureServiceRegionMatch = async (shippingZones) => {
  const whereConditions = shippingZones.map((shippingZone) => ({
    tmCode: shippingZone.tmCode.toUpperCase(),
    carrierName: shippingZone.carrierName.toLowerCase(),
    isActive: true,
  }));

  const existingServices = await prisma.deliveryService.findMany({
    where: {
      OR: whereConditions,
    },
  });

  return {
    allZonesHaveMatch: shippingZones.every((shippingZone) => {
      return existingServices.some((service) => {
        return (
          service.tmCode.toUpperCase() === shippingZone.tmCode.toUpperCase() &&
          service.carrierName.toLowerCase() ===
            shippingZone.carrierName.toLowerCase()
        );
      });
    }),
    existingServices,
  };
};
