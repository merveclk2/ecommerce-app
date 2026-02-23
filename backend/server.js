const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");

const JWT_SECRET = "supersecretkey";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= DATABASE ================= */

mongoose
    .connect("mongodb+srv://merve:merve123@cluster0.msvyvrc.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB bağlandı ✅"))
    .catch((err) => console.log("MongoDB hata:", err));

/* ================= SOCKET SERVER ================= */

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Yeni Bağlantı:", socket.id);
});

/* ================= MIDDLEWARE ================= */

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    console.log("COOKIE TOKEN:", token);

    if (!token)
        return res.status(401).json({ message: "Token gerekli" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(401).json({ message: "Geçersiz token" });
    }
}


function verifyAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Yetkisiz erişim" });
    }
    next();
}



app.get("/", (req, res) => {
    res.send("Backend çalışıyor 🚀");
});
app.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User bulunamadı" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.set("io", io);
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");

console.log("productRoutes:", productRoutes);
console.log("adminRoutes:", adminRoutes);

app.use("/products", productRoutes);
app.use("/admin", adminRoutes);


app.get("/public-products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});


app.post("/products", upload.single("image"), async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: Number(req.body.stock) || 0,
            image: req.file ? `/uploads/${req.file.filename}` : "",
        });

        await newProduct.save();
        router.delete("/:id", async (req, res) => {
            try {
                await Product.findByIdAndDelete(req.params.id);
                res.json({ message: "Ürün silindi" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        console.log("NEW ORDER EMIT:", newOrder._id);
        io.emit("newProduct", newProduct);

        res.json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/products/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Ürün bulunamadı" });
        }

        res.json({ message: "Ürün silindi" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post("/orders", verifyToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Geçerli quantity giriniz" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Ürün bulunamadı" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Yeterli stok yok" });
        }

        // 🔥 SADECE ORDER OLUŞTURULUYOR
        const newOrder = new Order({
            userId: req.user.id,
            productId: product._id,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            status: "pending",
        });
        console.log("ORDER CREATED:", newOrder._id);
        console.log("EMITTING NEW ORDER...");
        await newOrder.save();


        console.log("IO OBJECT:", io);
        // 🔥 SADECE ADMIN'E BİLDİR
        io.emit("newOrder", newOrder);

        res.json(newOrder);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});
app.delete("/orders/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);

        res.json({ message: "Sipariş silindi" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/my-orders", verifyToken, async (req, res) => {
    const myOrders = await Order.find({ userId: req.user.id });
    res.json(myOrders);
});

app.get("/favorites", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("favorites");
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post("/favorites/:productId", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.productId;

        const exists = user.favorites.some(
            (fav) => fav.toString() === productId
        );

        if (exists) {
            user.favorites = user.favorites.filter(
                (fav) => fav.toString() !== productId
            );
        } else {
            user.favorites.push(productId);
        }

        await user.save();

        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/orders/:id/complete", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Sipariş bulunamadı" });
        }

        if (order.status === "completed") {
            return res.status(400).json({ message: "Zaten tamamlanmış" });
        }

        const product = await Product.findOneAndUpdate(
            { _id: order.productId, stock: { $gte: order.quantity } },
            {
                $inc: {
                    stock: -order.quantity,
                    sold: order.quantity
                }
            },
            { new: true }
        );

        if (!product) {
            return res.status(400).json({ message: "Yeterli stok yok" });
        }

        order.status = "completed";
        await order.save();

        // 🔥 STOK GÜNCELLEMESİNİ HERKESE BİLDİR
        io.emit("stockUpdated", {
            productId: product._id,
            stock: product.stock
        });

        res.json(order);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});






app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ message: "Kullanıcı bulunamadı" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: "Şifre yanlış" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,      // localhost için false
        sameSite: "lax",    // önemli
        path: "/",          // önemli
    });

    res.json({ role: user.role });
});


app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Çıkış yapıldı." })
});
/* ================= START ================= */

server.listen(5000, () => {
    console.log("Server 5000 portunda çalışıyor 🚀");
});
