const mongoose = require('mongoose');

const userData = {
    name: String,
    email: String,
    image: String,
};
const userSchema = new mongoose.Schema(userData);
const User = new mongoose.model("User", userSchema);
module.exports = User;