const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 🔥 TÜM ÜRÜNLER
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔥 TEK ÜRÜN (ID İLE)
router.get("/:id", async (req, res) => {
    try {
        console.log("PARAM ID:", req.params.id);

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Ürün bulunamadı" });
        }

        res.json(product);

    } catch (err) {
        console.error("GET BY ID ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;