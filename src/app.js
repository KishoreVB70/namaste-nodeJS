const express = require("express");
const {connectMongoose} = require("./config/mongoose");
const User = require("./models/user");

async function main() {
    try {
        await connectMongoose();
        const app = express();
        app.post("/user", (req, res) => {
            const user = req.body;
        })
        app.listen("3000", () => {
            console.log("Server up and runnin")
        });
    } catch (error) {
        console.log(error);
    }
}

main();
