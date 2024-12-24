const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoose = async() => {
    await mongoose.connect(String(process.env.MONGOOSE_URI));
}

module.exports = {connectMongoose}