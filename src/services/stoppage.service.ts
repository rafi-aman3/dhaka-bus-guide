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
    const parsed = excelData.map((item) => ({
      nameEn: item.name_en || item.nameEn,
      nameBn: item.name_bn || item.nameBn,
      lat: item.lat ? Number(item.lat) : null,
      lon: item.lon ? Number(item.lon) : null,
    }));

    const stoppages = parsed.filter((s) => s.nameEn && s.nameBn);

    const created = await prisma.stoppage.createMany({
      data: stoppages,
      skipDuplicates: true,
    });

    return created.count;
  },
};
