const { loginSchema, setPasswordSchema } = require("../validators/auth.validators");
const authService = require("../services/auth.service");

async function loginController(req, res, next) {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        }

        const { email, password } = parsed.data;
        const result = await authService.login(email, password);

        res.json(result);
    } catch (err) {
        next(err);
    }
}

async function verifyInviteController(req, res, next) {
    try {
        const { token } = req.params;
        const result = await authService.verifyInvite(token);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

async function setPasswordController(req, res, next) {
    try {
        const parsed = setPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        }

        const { token, password } = parsed.data;
        await authService.setPassword(token, password);
        res.json({ message: "Mot de passe défini avec succès" });
    } catch (err) {
        next(err);
    }
}

module.exports = { loginController, verifyInviteController, setPasswordController };