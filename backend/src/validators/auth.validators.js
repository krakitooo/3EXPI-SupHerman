const { z } = require("zod");

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Mot de passe requis"),
});

const setPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8, "8 caractères minimum"),
});

module.exports = { loginSchema, setPasswordSchema };