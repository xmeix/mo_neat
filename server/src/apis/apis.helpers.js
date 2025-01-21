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
