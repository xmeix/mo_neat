import prisma from "../../db/prismaClient.js";
import ValidationError from "../../utils/errors/ValidationError.js";

//tested: success
export const createOrUpdateWilaya = async (req, res, next) => {
  try {
    const { name, communes, code, isActive } = req.body;
    const omittedCommunes = [];
    const communesToUpdate = [];

    const wilayaCode = parseInt(code);

    // Extract postal codes and commune IDs from input
    const postalCodes = communes
      .map((c) => parseInt(c.postalCode))
      .filter(Boolean);
    const communeIds = communes
      .map((c) => parseInt(c.communeId))
      .filter(Boolean);
    const communeNames = communes.map((c) => c.name.toLowerCase().trim());

    // Fetch existing communes based on postal code or ID
    // Fetch existing communes in the same wilaya
    const foundCommunes = await prisma.commune.findMany({
      where: {
        wilaya: { code: wilayaCode },
        OR: [
          { postalCode: { in: postalCodes } },
          { id: { in: communeIds } },
          { name: { in: communeNames } },
        ],
      },
      select: { id: true, postalCode: true, name: true },
    });

    // Determine communes to connect, update, or omit
    const communesToConnect = [];
    const communesToCreate = [];

    communes.forEach((c) => {
      const postalCode = parseInt(c.postalCode);
      const communeName = c.name.toLowerCase().trim();

      const existingCommune = foundCommunes.find(
        (fc) => fc.name.toLowerCase() === communeName
      );

      // Exclude communes that don't match the wilaya code
      if (!String(postalCode).startsWith(wilayaCode.toString())) {
        omittedCommunes.push(c);
        return;
      }

      if (existingCommune) {
        if (c.isActive === undefined) {
          omittedCommunes.push(c);
          return;
        }

        if (existingCommune.postalCode !== postalCode) {
          omittedCommunes.push(c);
          return;
        }

        // If commune exists, prepare it for an update
        communesToUpdate.push({
          where: { postalCode: parseInt(postalCode) },
          data: {
            name: c.name || existingCommune.name,
            isActive: c.isActive !== undefined ? c.isActive : undefined,
          },
        });
        communesToConnect.push({ id: existingCommune.id });
      } else if (!c.communeId) {
        // If commune is new, prepare it for creation
        communesToCreate.push({
          name: c.name,
          postalCode,
          isActive: c.isActive !== undefined ? c.isActive : undefined,
        });
      }
    });

    // Execute transaction: Update existing communes and upsert wilaya
    await prisma.$transaction([
      ...communesToUpdate.map((c) => prisma.commune.update(c)),
      prisma.wilaya.upsert({
        where: { code: wilayaCode },
        update: {
          name: name || undefined,
          communes: {
            connect: communesToConnect,
            create: communesToCreate,
          },
          isActive: isActive !== undefined ? isActive : undefined,
        },
        create: {
          name,
          code: wilayaCode,
          isActive: isActive !== undefined ? isActive : undefined,
          communes: {
            connect: communesToConnect,
            create: communesToCreate,
          },
        },
      }),
    ]);

    // Retrieve updated Wilaya with associated communes
    const updatedWilaya = await prisma.wilaya.findUnique({
      where: { code: wilayaCode },
      include: { communes: true },
    });

    res.status(201).json({
      success: true,
      data: updatedWilaya,
      message: `${updatedWilaya.name} created/updated successfully with ${updatedWilaya.communes.length} communes, ${communesToConnect.length} connected, ${communesToCreate.length} created, ${communesToUpdate.length} updated, ${omittedCommunes.length} omitted.`,
    });
  } catch (error) {
    console.error("Error creating wilaya:", error);
    next(error);
  }
};

//tested: success
export const getAllWilayas = async (req, res, next) => {
  try {
    const wilayas = await prisma.wilaya.findMany({
      include: {
        communes: true,
      },
    });

    res.status(200).json({
      success: true,
      data: wilayas,
      message: `${wilayas.length} Wilaya(s) retrieved successfully`,
    });
  } catch (error) {
    next(error);
  }
};

//tested: success
export const deleteWilaya = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // Parse the IDs as integers
    const wilayaIds = ids.map((id) => parseInt(id));

    // Find all the delivery services that match the provided IDs
    const wilayas = await prisma.wilaya.findMany({
      where: {
        id: { in: wilayaIds },
      },
    });

    // If no delivery services are found, return an error
    if (wilayas.length === 0) {
      throw new BaseError(
        "Not Found",
        404,
        true,
        `No wilayas found with the provided ID(s).`
      );
    }

    // Delete the delivery services
    await prisma.wilaya.deleteMany({
      where: {
        id: { in: wilayaIds },
      },
    });

    return res.status(200).json({
      success: true,
      data: wilayaIds,
      message: `${wilayas.length} wilaya(s) deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting wilaya:", error);
    next(error);
  }
};

export const createCommune = async (req, res, next) => {
  try {
    const { name, postalCode, wilayaId } = req.body;

    //check if wilaya exists
    const wilaya = await prisma.wilaya.findFirst({
      where: {
        id: wilayaId,
      },
    });

    if (!wilaya) {
      throw new ValidationError(`Wilaya with id ${wilayaId} not found`);
    }

    if (String(wilaya.code) !== postalCode.slice(0, 2)) {
      throw new ValidationError(
        `Wilaya code ${wilaya.code} does not match the postal code ${postalCode}`
      );
    }

    const commune = await prisma.commune.create({
      data: {
        name,
        postalCode,
        isActive: true,
        wilaya: {
          connect: { id: wilayaId },
        },
        includes: {
          wilaya: true,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: commune,
      message: `${commune.name} created successfully in the wilaya ${commune.wilaya.name}`,
    });
  } catch (error) {
    console.error("Error creating commune:", error);
    next(error);
  }
};

export const createOrUpdateCommune = async (req, res, next) => {
  try {
    const { name, postalCode, wilayaId, communeId, isActive } = req.body;
    res.status(201).json({
      success: true,
      data: commune,
      message: `${commune.name} created successfully in the wilaya ${commune.wilaya.name}`,
    });
  } catch (error) {
    console.error("Error creating commune:", error);
    next(error);
  }
};

export const updateCommune = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive, wilayaId, postalCode } = req.body;

    //check if the new name exist in the database for another commune in the same wilaya
    const existingCommune = await prisma.commune.findFirst({
      where: {
        OR: [{ AND: [{ name }, { wilayaId }] }, { postalCode }],
        NOT: {
          id: id,
        },
      },
    });

    if (existingCommune) {
      throw new ValidationError(
        `Commune with the same name ${name} for the same wilaya ${existingCommune.wilaya.name} already exists`
      );
    }
    if (existingCommune.wilaya.code !== postalCode.slice(0, 2)) {
      throw new ValidationError(
        `the postal code ${postalCode} does not match the wilaya code ${existingCommune.wilaya.code}`
      );
    }

    const updatedCommune = await prisma.commune.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        isActive: isActive || undefined,
        postalCode: postalCode || undefined,
      },
      include: {
        wilaya: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedCommune,
      message: "Commune updated successfully",
    });
  } catch (error) {
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

    res.status(200).json({
      success: true,
      data: communes,
      message: `${communes.length} commune(s) retrieved successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommunes = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // Parse the IDs as integers
    const communeIds = ids.map((id) => parseInt(id));

    // Find all the communes that match the provided IDs
    const communes = await prisma.commune.findMany({
      where: {
        id: { in: communeIds },
      },
    });

    // If no delivery services are found, return an error
    if (communes.length === 0) {
      throw new BaseError(
        "Not Found",
        404,
        true,
        `No communes found with the provided ID(s).`
      );
    }

    // Delete the delivery services
    await prisma.commune.deleteMany({
      where: {
        id: { in: communeIds },
      },
    });

    return res.status(200).json({
      success: true,
      data: communeIds,
      message: `${communes.length} commune(s) deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting commune:", error);
    next(error);
  }
};
