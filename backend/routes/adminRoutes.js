const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 🔥 ADMIN - TÜM ÜRÜNLERİ GETİR
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔥 STOK GÜNCELLEME
router.put("/update-stock/:id", async (req, res) => {
    try {
        const { stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Ürün bulunamadı" });
        }

        product.stock = stock;
        await product.save();

        const io = req.app.get("io");
        io.emit("stockUpdated", {
            productId: product._id,
            stock: product.stock,
        });

        res.json({ message: "Stok güncellendi" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;