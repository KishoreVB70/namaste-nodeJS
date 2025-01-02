const mongoose = require('mongoose');

const connection = {
    fromId: String,
    toId: String,
    status: String,
};
const connectionSchema = new mongoose.Schema(connection);
const Connection = new mongoose.model("User", connectionSchema);
module.exports = Connection;