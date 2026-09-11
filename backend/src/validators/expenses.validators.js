const { z } = require("zod");

const createExpenseSchema = z.object({
  title: z.string().min(1, "Titre requis").max(200),
  comment: z.string().max(2000).optional(),
});

module.exports = { createExpenseSchema };