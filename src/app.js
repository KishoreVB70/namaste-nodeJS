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

        app.use('/user/:userID', async(req,res, next) => {
            try {
                if (req.params.userID  > 100) {
                    res.status(400).send({message: "User id out of bound"});
                } else {
                    next();
                }
            } catch(error) {
                console.log(error);
                res.status(500).send({message: "something went wrong"});
            }
        }, async(req, res) => {
            try {
                console.log(req.params.userID);
                res.status(200).send({user: {
                    "name": "puffy",
                    "urlID": `${req.params.userID}`,
                }});
            }catch(error) {
                console.log(error);
                res.status(500).send({message: "something went wrong"});
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
