const bcrypt = require("bcrypt");
const prisma = require("../config/prismaClient");
const { signToken } = require("../utils/token");
const { hashInviteToken } = require("../utils/inviteToken");

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

async function verifyInvite(rawToken) {
    const tokenHash = hashInviteToken(rawToken);

    const user = await prisma.user.findFirst({
        where: { inviteTokenHash: tokenHash },
    });

    if (!user || !user.inviteTokenExpires || user.inviteTokenExpires < new Date()) {
        throw { status: 400, message: "Lien d'invitation invalide ou expiré" };
    }

    return { email: user.email };
}

async function setPassword(rawToken, password) {
    const tokenHash = hashInviteToken(rawToken);

    const user = await prisma.user.findFirst({
        where: { inviteTokenHash: tokenHash },
    });

    if (!user || !user.inviteTokenExpires || user.inviteTokenExpires < new Date()) {
        throw { status: 400, message: "Lien d'invitation invalide ou expiré" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
            inviteTokenHash: null,
            inviteTokenExpires: null,
        },
    });
}

module.exports = { login, verifyInvite, setPassword };