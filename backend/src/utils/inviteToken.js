const crypto = require("crypto");

const INVITE_EXPIRATION_HOURS = 72;

function generateInviteToken() {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + INVITE_EXPIRATION_HOURS * 60 * 60 * 1000);

    return { rawToken, tokenHash, expires };
}

function hashInviteToken(rawToken) {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
}

module.exports = { generateInviteToken, hashInviteToken };