const express = require("express");
const {connectMongoose} = require("./config/mongoose");
const User = require("./models/user");

async function main() {
    try {
        await connectMongoose();
        const app = express();

        app.use(express.json());
        app.post("/user", async(req, res) => {
            try {
                console.log("got request");
                const user = req.body;
                const userModel = new User(user);
                await userModel.save();
                res.status(200).send("User created");
            } catch (error) {
                console.log(error);
                res.status(500).send("Unable to create user");
            }

        })
        app.listen("3100", () => {
            console.log("Server up and runnin")
        });
    } catch (error) {
        console.log(error);
    }
}

main();
