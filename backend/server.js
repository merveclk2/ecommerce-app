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
const RefreshToken = require("./models/RefreshToken");
const { v4: uuidv4 } = require("uuid");
const authRoutes = require("./routes/authRoutes");


require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");

const Product = require("./models/Product");
const Order = require("./models/Order");


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




app.use("/api/users", userRoutes);
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


require("./socket/supportSocket")(io);
/* ================= MIDDLEWARE ================= */

function verifyToken(req, res, next) {
    const token = req.cookies.accessToken;  // 🔥 BURASI DEĞİŞTİ

    console.log("COOKIE ACCESS TOKEN:", token);

    if (!token)
        return res.status(401).json({ message: "Token gerekli" });

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_SECRET
        );

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

app.use("/auth", authRoutes);
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

    // ACCESS TOKEN
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    // 🔑 JTI ÖNCE OLUŞTURULUR
    const jti = uuidv4();

    // REFRESH TOKEN
    const rawRefreshToken = jwt.sign(
        { id: user._id, jti },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    const hashedToken = await bcrypt.hash(rawRefreshToken, 10);

    await RefreshToken.create({
        userId: user._id,
        jti,
        tokenHash: hashedToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/"
    });

    res.cookie("refreshToken", rawRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/"
    });

    res.json({ role: user.role });
});
app.use("/uploads", express.static("uploads"));

app.post("/refresh-token", async (req, res) => {

    const token = req.cookies.refreshToken;

    if (!token)
        return res.status(401).json({ message: "Refresh token yok" });

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (err) {
        return res.status(403).json({ message: "Geçersiz refresh token" });
    }

    const storedToken = await RefreshToken.findOne({ jti: decoded.jti });

    if (!storedToken)
        return res.status(403).json({ message: "Token DB'de yok" });

    const isMatch = await bcrypt.compare(token, storedToken.tokenHash);

    if (!isMatch) {
        await storedToken.deleteOne();
        return res.status(403).json({ message: "Token eşleşmiyor" });
    }

    if (storedToken.expiresAt < new Date()) {
        await storedToken.deleteOne();
        return res.status(403).json({ message: "Refresh süresi dolmuş" });
    }

    // 🔄 ROTATION
    await storedToken.deleteOne();

    const newJti = uuidv4();

    const newRawRefreshToken = jwt.sign(
        { id: decoded.id, jti: newJti },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    const newHashedToken = await bcrypt.hash(newRawRefreshToken, 10);

    await RefreshToken.create({
        userId: decoded.id,
        jti: newJti,
        tokenHash: newHashedToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip
    });

    const user = await User.findById(decoded.id);

    const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/"
    });

    res.cookie("refreshToken", newRawRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/"
    });

    res.json({ message: "Token yenilendi" });
});


app.post("/logout", async (req, res) => {

    const token = req.cookies.refreshToken;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
            await RefreshToken.deleteOne({ jti: decoded.jti });
        } catch (err) {
            // geçersizse de cookie temizlenecek
        }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Çıkış yapıldı." });
});


server.listen(5000, () => {
    console.log("Server 5000 portunda çalışıyor 🚀");
});
