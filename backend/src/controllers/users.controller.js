const { createAccountSchema } = require("../validators/users.validators");
const usersService = require("../services/users.service");

async function createAccountController(req, res, next) {
    try {
        const parsed = createAccountSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        }

        const { email, role } = parsed.data;
        const result = await usersService.createAccount(email, role);

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = { createAccountController };