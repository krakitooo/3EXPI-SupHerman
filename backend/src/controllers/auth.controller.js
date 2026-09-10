const { loginSchema } = require("../validators/auth.validators");
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

module.exports = { loginController };