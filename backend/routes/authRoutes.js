const express = require("express");
const router = express.Router();

const {
    login,
    refreshTokenHandler,
    logout,
    getMe,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logout);
router.get("/me", getMe);
module.exports = router;