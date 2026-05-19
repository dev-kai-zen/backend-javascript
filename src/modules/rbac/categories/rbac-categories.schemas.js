import { z } from "zod";

export const createCategoryBodySchema = z.object({
  categoryName: z
    .string({ required_error: "categoryName is required" })
    .trim()
    .min(1, "categoryName is required"),
});

export const updateCategoryBodySchema = createCategoryBodySchema;
