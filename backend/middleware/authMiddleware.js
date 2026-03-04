const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Token yok" });
    }

    try {

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({ message: "Token geçersiz" });
    }

};

module.exports = { protect };