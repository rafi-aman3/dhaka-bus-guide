import prisma from "../prisma";
import logger from "../utils/logger";

export const StoppageService = {
  getAll: async () => {
    logger.debug("Service: Getting all stoppages");
    const stoppages = await prisma.stoppage.findMany({
      orderBy: { id: "asc" },
    });
    logger.debug(`Service: Retrieved ${stoppages.length} stoppages`);
    return stoppages;
  },

  getById: async (id: number) => {
    logger.debug({ id }, "Service: Getting stoppage by id");
    const stoppage = await prisma.stoppage.findUnique({ where: { id } });
    if (!stoppage) {
      logger.debug({ id }, "Service: Stoppage not found");
    }
    return stoppage;
  },

  create: async (data: {
    nameBn: string;
    nameEn: string;
    lat?: number;
    lon?: number;
  }) => {
    logger.debug({ data }, "Service: Creating stoppage");
    const stoppage = await prisma.stoppage.create({ data });
    logger.debug({ id: stoppage.id }, "Service: Stoppage created");
    return stoppage;
  },

  update: async (
    id: number,
    data: Partial<{
      nameBn: string;
      nameEn: string;
      lat?: number;
      lon?: number;
    }>
  ) => {
    logger.debug({ id, data }, "Service: Updating stoppage");
    try {
      const updated = await prisma.stoppage.update({
        where: { id },
        data,
      });
      logger.debug({ id }, "Service: Stoppage updated");
      return updated;
    } catch (error) {
      logger.error({ err: error, id }, "Service: Error updating stoppage");
      return null; // or throw error if you want to handle differently
    }
  },

  delete: async (id: number) => {
    logger.debug({ id }, "Service: Deleting stoppage");
    try {
      const deleted = await prisma.stoppage.delete({ where: { id } });
      logger.debug({ id }, "Service: Stoppage deleted");
      return deleted;
    } catch (error) {
      logger.error({ err: error, id }, "Service: Error deleting stoppage");
      return null;
    }
  },

  bulkCreateFromExcel: async (excelData: any[]) => {
    logger.info(`bulkCreateFromExcel called with ${excelData.length} items`);
    logger.info("Sample raw data:", excelData.slice(0, 2));

    const parsed = excelData.map((item, index) => {
      const result = {
        nameEn: item.name_en || item.nameEn || item.NameEn || item.NAME_EN,
        nameBn: item.name_bn || item.nameBn || item.NameBn || item.NAME_BN,
        lat:
          item.lat || item.latitude ? Number(item.lat || item.latitude) : null,
        lon:
          item.lon || item.lng || item.longitude
            ? Number(item.lon || item.lng || item.longitude)
            : null,
      };

      if (index < 3) {
        logger.info(`Parsed item ${index}:`, result);
      }

      return result;
    });

    logger.info(`Parsed ${parsed.length} items`);

    const validStoppages = parsed.filter((s) => s.nameEn && s.nameBn);
    logger.info(`Filtered to ${validStoppages.length} valid stoppages`);

    if (validStoppages.length === 0) {
      logger.warn("No valid stoppages found after filtering");
      return 0;
    }

    logger.info("Sample valid stoppages:", validStoppages.slice(0, 2));

    try {
      const created = await prisma.stoppage.createMany({
        data: validStoppages,
        skipDuplicates: true,
      });

      logger.info(
        `Successfully created ${created.count} stoppages in database`
      );
      return created.count;
    } catch (error) {
      logger.error("Database error in bulkCreateFromExcel:", error);
      throw error;
    }
  },
};
