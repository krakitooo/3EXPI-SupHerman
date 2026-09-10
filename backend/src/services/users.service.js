const prisma = require("../config/prismaClient");
const { generateInviteToken } = require("../utils/inviteToken");

async function createAccount(email, role) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw { status: 409, message: "Un compte existe déjà avec cet email" };
    }

    const { rawToken, tokenHash, expires } = generateInviteToken();

    const user = await prisma.user.create({
        data: {
            email,
            role,
            inviteTokenHash: tokenHash,
            inviteTokenExpires: expires,
        },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${rawToken}`;

    return {
        user: { id: user.id, email: user.email, role: user.role },
        inviteLink,
    };
}

module.exports = { createAccount };