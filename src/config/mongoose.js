const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoose = async() => {
    try {
        await mongoose.connect(String(process.env.MONGOOSE_URI));
        console.log("Mongoose connected");
    } catch(error) {
        console.log(error);
    }
}

module.exports = {connectMongoose}