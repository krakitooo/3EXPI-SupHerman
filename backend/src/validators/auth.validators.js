const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Mot de passe requis"),
});

module.exports = { loginSchema };