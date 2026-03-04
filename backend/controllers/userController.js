const User = require("../models/User");

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User bulunamadı" });
        }

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.adress = req.body.adress || user.adress;




        if (req.file) {
            user.avatar = "/uploads/" + req.file.filename;
        }

        await user.save();

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};