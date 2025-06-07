import { z } from "zod";

export const createStoppageSchema = z.object({
  nameEn: z
    .string()
    .min(2, { message: "English name must be at least 2 characters" }),
  nameBn: z
    .string()
    .min(2, { message: "Bangla name must be at least 2 characters" }),
  lat: z
    .number({ invalid_type_error: "Latitude must be a number" })
    .min(-90, { message: "Latitude must be between -90 and 90" })
    .max(90, { message: "Latitude must be between -90 and 90" }),
  lon: z
    .number({ invalid_type_error: "Longitude must be a number" })
    .min(-180, { message: "Longitude must be between -180 and 180" })
    .max(180, { message: "Longitude must be between -180 and 180" }),
});

export const updateStoppageSchema = createStoppageSchema.partial();
