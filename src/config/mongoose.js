const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoose = async() => {
    try {
        console.log("Connecting to db....");
        await mongoose.connect(String(process.env.MONGOOSE_URI));
        console.log("DB connected");
    } catch(error) {
        console.log(error);
    }
}

module.exports = connectMongoose