const express = require("express");
const {connectMongoose} = require("./config/mongoose");
const User = require("./models/user");

async function main() {
    try {
        // connect to database
        // await connectMongoose();
        console.log("hi");

        const app = express();

        // Parse JSON
        app.use(express.json());

        app.use('/user', async(req, res) => {
            try {
                console.log(req.query);
                res.status(200).send({user: {"name": "puffy", "id": `${req.query}`}});
            }catch(error) {
                console.log(error);
            }
        })
        // Post request
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
        app.listen("3000", () => {
            console.log("Server up and runnin")
        });
    } catch (error) {
        console.log(error);
    }
}

main();
