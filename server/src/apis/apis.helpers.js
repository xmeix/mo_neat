import prisma from "../db/prismaClient.js";

export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const groupKey = key(item);
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}

export const ensureWilayasExist = async (wilayaNames) => {
  const existingWilayas = await prisma.wilaya.findMany({
    where: { name: { in: wilayaNames } },
  });

  const wilayaMap = new Map();

  existingWilayas.forEach((wil) => wilayaMap.set(wil.name, wil));

  let wilayasDataToCreate = [];
  let wilayasWhereToActivate = [];
  for (const wilayaName of wilayaNames) {
    if (!wilayaMap.has(wilayaName)) {
      // // Create the Wilaya if it does not exist

      wilayasDataToCreate.push({
        name: wilayaName,
      });
    } else if (!wilayaMap.get(wilayaName).isActive) {
      // Reactivate the Wilaya if it exists but is inactive

      wilayasWhereToActivate.push(wilayaMap.get(wilayaName).id);
    }
  }
  let wilayasCreated = [];
  let wilayasReactivated = [];
  //createMany and activate many
  if (wilayasDataToCreate.length > 0) {
    wilayasCreated = await prisma.wilaya.createManyAndReturn({
      data: wilayasDataToCreate,
      skipDuplicates: true,
    });
  }
  console.log(wilayasWhereToActivate);
  if (wilayasWhereToActivate.length > 0) {
    await prisma.wilaya.updateMany({
      where: { id: { in: wilayasWhereToActivate } },
      data: {
        isActive: true,
      },
    });
    wilayasReactivated = await prisma.wilaya.findMany({
      where: { id: { in: wilayasWhereToActivate } },
    });
  }

  // Update the map with the newly created and reactivated wilayas
  wilayasCreated.forEach((wil) => wilayaMap.set(wil.name, wil));
  wilayasReactivated.forEach((wil) => wilayaMap.set(wil.name, wil));
  return { wilayaMap, wilayasCreated, wilayasReactivated };
};

export const ensureRegionsExist = async (regions, wilayaMap) => {
  const postalCodes = [...new Set(regions.map((r) => r.postalCode))];

  // Fetch existing regions (communes) by postal code
  const existingRegions = await prisma.commune.findMany({
    where: { postalCode: { in: postalCodes } },
  });

  const regionsMap = new Map(
    existingRegions.map((region) => [region.postalCode, region])
  );

  let regionsDataToCreate = [];
  let regionsWhereToReactivate = [];

  // Separate regions to create or reactivate
  regions.forEach((region) => {
    const existingRegion = regionsMap.get(region.postalCode);
    const wilayaId = wilayaMap.get(region.wilaya)?.id;

    if (!existingRegion) {
      regionsDataToCreate.push({
        name: region.commune,
        wilayaId,
        postalCode: region.postalCode,
      });
    } else if (!existingRegion.isActive) {
      regionsWhereToReactivate.push(existingRegion.id);
    }
  });

  //createMany and activate many
  let regionsCreated = [];
  let regionsReactivated = [];

  if (regionsDataToCreate.length > 0) {
    regionsCreated = await prisma.commune.createManyAndReturn({
      data: regionsDataToCreate,
      skipDuplicates: true,
    });
  }
  console.log("regionsWhereToReactivate");
  console.log(regionsWhereToReactivate);
  if (regionsWhereToReactivate.length > 0) {
    await prisma.commune.updateMany({
      where: {
        id: { in: regionsWhereToReactivate },
      },
      data: {
        isActive: true,
      },
    });

    regionsReactivated = await prisma.commune.findMany({
      where: {
        id: { in: regionsWhereToReactivate },
      },
    });
  }

  // Update the map with the newly created and reactivated wilayas
  regionsCreated.forEach((reg) => regionsMap.set(reg.postalCode, reg));
  regionsReactivated.forEach((reg) => regionsMap.set(reg.postalCode, reg));

  return {
    regionsMap,
    regionsCreated,
    regionsReactivated,
  };
};

export const createCarrier = async (carrierName) => {
  const carrier = await prisma.carrier.findFirst({
    where: { name: carrierName },
  });
  const newCarrier = carrier;
  if (!carrier) {
    // create a new carrier
    newCarrier = await prisma.carrier.create({
      data: {
        name: carrierName,
      },
    });
  }

  return newCarrier;
};

export const createRelayPoints = async (relayPoints, serviceId) => {
  const newRelayPoints = [];
  if (relayPoints.length > 0) {
    // get relay points that exist in the database
    // how to: when theres a relay point that has the same name and communeId
    // in the database, it means it already exists
    const existingRelayPoints = await prisma.relayPoints.findMany({
      where: {
        AND: [
          { communeId: { in: relayPoints.map((point) => point.communeId) } },
          { name: { in: relayPoints.map((point) => point.name) } },
        ],
      },
    });

    //fetch from the relaypoints array the ones that don't exist in the database
    const notExistingRelayPoints = relayPoints.filter(
      (point) =>
        !existingRelayPoints.find(
          (existingPoint) =>
            existingPoint.communeId === point.communeId &&
            existingPoint.name === point.name
        )
    );

    // get relay points where communeId exist in db
    const notExistingRelayPointsWExistingCommune = findItemsWexistingCommunes(
      notExistingRelayPoints
    );

    // create NonExitingRelayPointsWExistingCommune
    newRelayPoints = await prisma.relayPoints.createMany({
      data: notExistingRelayPointsWExistingCommune.map((point) => {
        return {
          name: point.name,
          address: point.address,
          deliveryFee: point.deliveryFee,
          communeId: point.communeId,
          serviceId,
        };
      }),
    });
  }
  return newRelayPoints;
};

export const findItemsWexistingCommunes = async (items) => {
  // check if the communeId exists in the database
  const existingCommunes = await prisma.commune.findMany({
    where: {
      id: { in: items.map((el) => el.communeId) },
    },
  });

  // get items where communeId exist in db
  const itemsWExistingCommune = items.filter((el) =>
    existingCommunes.find((commune) => {
      return commune.id === el.communeId;
    })
  );

  return itemsWExistingCommune;
};

export const createZones = async (zones, serviceId) => {
  const newZones = [];
  if (zones.length > 0) {
    const existingZones = await prisma.HomeDeliveryZone.findMany({
      where: {
        AND: [
          { communeId: { in: zones.map((z) => z.communeId) } },
          { serviceId: serviceId },
        ],
      },
    });

    //fetch from the zones array the ones that don't exist in the database
    const notExistingZones = zones.filter(
      (zone) =>
        !existingZones.find(
          (existingZone) =>
            existingZone.communeId === zone.communeId &&
            existingZone.serviceId === serviceId
        )
    );
    // check if the communeId exists in the database
    const notExistingZonesWExistingCommune =
      findItemsWexistingCommunes(notExistingZones);

    // create NonExitingZonesWExistingCommune
    newZones = await prisma.zone.createMany({
      data: notExistingZonesWExistingCommune.map((z) => {
        return {
          isActive: z.isActive || true,
          deliveryFee: z.deliveryFee,
          communeId: z.communeId,
          deliveryServiceId: serviceId,
        };
      }),
    });
  }
  return newZones;
};

/*
export const checkSimilarRegions = async (regions, existingServiceId) => {
  //here we need to check first if one of the regions
  // contains a postal code that already exists in the commune table ==> error region exists
  // contains commune of the same wilaya in the database but doesn't have the same postalcode in regions with the pcode in db ==> error region exists but with a different postal code
  // the combo exists but not active in the database ===> should just activate it

  return await prisma.commune.findMany({
    where: {
      name: { in: regionNames },
      isActive: true,
      wilaya: {
        name: { in: wilayaNames },
      },
      deliveryAreas: {
        some: {
          deliveryServiceId: existingServiceId,
        },
      },
    },
  });
};
*/
