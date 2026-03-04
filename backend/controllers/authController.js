const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");



// =============================
// 👤 GET ME
// =============================
const getMe = async (req, res) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Yetkisiz" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        res.json(user);

    } catch (error) {
        res.status(401).json({ message: "Token geçersiz veya süresi dolmuş" });
    }
};



// =============================
// 🔐 LOGIN
// =============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Kullanıcı bulunamadı" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Şifre yanlış" });
        }

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax"
        });

        res.json({ message: "Login başarılı" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};



// =============================
// 🔁 REFRESH TOKEN
// =============================
const refreshTokenHandler = async (req, res) => {
    try {
        const incomingToken = req.cookies?.refreshToken;

        if (!incomingToken) {
            return res.status(401).json({ message: "Refresh token yok" });
        }

        const verified = jwt.verify(
            incomingToken,
            process.env.REFRESH_SECRET
        );

        const storedToken = await RefreshToken.findOne({
            token: incomingToken
        });

        if (!storedToken) {
            return res.status(403).json({ message: "Token veritabanında yok" });
        }

        if (storedToken.expiresAt < new Date()) {
            await storedToken.deleteOne();
            return res.status(403).json({ message: "Refresh token süresi dolmuş" });
        }

        const newAccessToken = jwt.sign(
            { id: verified.id },
            process.env.ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "lax"
        });

        res.json({ message: "Refresh başarılı" });

    } catch (error) {
        console.error("Refresh error:", error.message);
        res.status(403).json({ message: "Refresh başarısız" });
    }
};



// =============================
// 🚪 LOGOUT
// =============================
const logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await RefreshToken.deleteOne({ token });
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.json({ message: "Çıkış yapıldı" });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};



// =============================
// EXPORT
// =============================
module.exports = {
    getMe,
    login,
    refreshTokenHandler,
    logout,
};