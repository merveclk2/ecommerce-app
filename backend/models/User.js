const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatar: String,
    password: String,
    role: {
        type: String,
        default: "user"
    },

    phone: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

});

const User = mongoose.model("User", userSchema);

module.exports = User;