const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

/* MULTER AYARI */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/* ROUTES */

router.get("/profile", protect, getProfile);

router.put("/profile", protect, upload.single("avatar"), updateProfile);

module.exports = router;