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
  const wilayasCreated = [];
  const wilayasReactivated = [];

  existingWilayas.forEach((wil) => wilayaMap.set(wil.name, wil));

  for (const wilayaName of wilayaNames) {
    if (!wilayaMap.has(wilayaName)) {
      // Create the Wilaya if it does not exist
      const newWilaya = await prisma.wilaya.create({
        data: {
          name: wilayaName,
        },
      });
      wilayaMap.set(wilayaName, newWilaya);
      wilayasCreated.push(newWilaya);
    } else if (!wilayaMap.get(wilayaName).isActive) {
      // Reactivate the Wilaya if it exists but is inactive
      const updatedWilaya = await prisma.wilaya.update({
        where: { id: wilayaMap.get(wilayaName).id },
        data: { isActive: true },
      });
      wilayaMap.set(wilayaName, updatedWilaya);
      wilayasReactivated.push(updatedWilaya);
    }
  }

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

  const regionsToCreate = [];
  const regionsToReactivate = [];

  // Separate regions to create or reactivate
  regions.forEach((region) => {
    const existingRegion = regionsMap.get(region.postalCode);

    if (!existingRegion) {
      regionsToCreate.push(region);
    } else if (!existingRegion.isActive) {
      regionsToReactivate.push(existingRegion);
    }
  });

  // Create new regions
  const createdRegions = await Promise.all(
    regionsToCreate.map((region) => {
      const wilayaId = wilayaMap.get(region.wilaya)?.id;
      return prisma.commune
        .create({
          data: {
            name: region.commune,
            wilayaId,
            postalCode: region.postalCode,
          },
        })
        .then((newRegion) => {
          regionsMap.set(newRegion.postalCode, newRegion);
          return newRegion;
        });
    })
  );

  // Reactivate inactive regions
  const reactivatedRegions = await Promise.all(
    regionsToReactivate.map((region) =>
      prisma.commune
        .update({
          where: { id: region.id },
          data: { isActive: true },
        })
        .then((updatedRegion) => {
          regionsMap.set(updatedRegion.postalCode, updatedRegion);
          return updatedRegion;
        })
    )
  );

  return {
    regionsMap,
    regionsCreated: createdRegions,
    regionsReactivated: reactivatedRegions,
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
