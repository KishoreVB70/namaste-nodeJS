const mongoose = require('mongoose');

const userData = {
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
};
const userSchema = new mongoose.Schema(userData);
const User = new mongoose.model("User", userSchema);
module.exports = User;