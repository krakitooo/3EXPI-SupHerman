const bcrypt = require("bcrypt");
const prisma = require("../config/prismaClient");
const { signToken } = require("../utils/token");

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    throw { status: 401, message: "Email ou mot de passe incorrect" };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw { status: 401, message: "Email ou mot de passe incorrect" };
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
}

module.exports = { login };