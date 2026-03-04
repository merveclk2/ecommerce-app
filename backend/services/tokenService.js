const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const RefreshToken = require("../models/RefreshToken");

const createRefreshToken = async (user, req) => {

    const jti = uuidv4();

    const rawToken = jwt.sign(
        { id: user._id, jti },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    const tokenHash = await bcrypt.hash(rawToken, 10);

    await RefreshToken.create({
        userId: user._id,
        jti,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip
    });

    return rawToken;
};

const validateRefreshToken = async (token) => {

    if (!token)
        return { valid: false, message: "Token yok" };

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch {
        return { valid: false, message: "JWT geçersiz" };
    }

    const stored = await RefreshToken.findOne({ jti: decoded.jti });

    if (!stored)
        return { valid: false, message: "DB'de yok" };

    const match = await bcrypt.compare(token, stored.tokenHash);

    if (!match) {
        await RefreshToken.deleteMany({ userId: stored.userId });
        return { valid: false, message: "Token reuse tespit edildi" };
    }

    if (stored.expiresAt < new Date()) {
        await stored.deleteOne();
        return { valid: false, message: "Token süresi dolmuş" };
    }

    return { valid: true, userId: decoded.id, stored };
};

module.exports = {
    createRefreshToken,
    validateRefreshToken
};