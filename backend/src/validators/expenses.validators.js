const { z } = require("zod");

const createExpenseSchema = z.object({
  title: z.string().min(1, "Titre requis").max(200),
  comment: z.string().max(2000).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["VALIDEE", "REFUSEE", "TRAITEE"]),
});

module.exports = { createExpenseSchema, updateStatusSchema };