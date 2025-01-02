const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoose = async() => {
    try {
        console.log(String(process.env.MONGOOSE_URI));
        const result = await mongoose.connect(String(process.env.MONGOOSE_URI));
        console.log(result);
    } catch(error) {
        console.log(error);
    }
}

module.exports = {connectMongoose}