const { z } = require("zod");

const createAccountSchema = z.object({
    email: z.string().email(),
    role: z.enum(["EMPLOYE", "MANAGER", "COMPTABILITE"]),
});

module.exports = { createAccountSchema };