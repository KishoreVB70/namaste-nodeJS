const express = require("express");
const connectMongoose = require("./config/mongoose");
const User = require("./models/user");
const useridmd = require("./middleware/userid");

async function main() {
    try {
        // connect to database
        await connectMongoose();

        const app = express();

        // Parse JSON
        app.use(express.json());

        app.use('/user/:userID', useridmd, async(req, res) => {
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
                const password = req.body;
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

        app.use("/", (err, req, res, next) => {
            if (err) {
                console.log(err); 
                if (err.message) {
                    res.status(500).send(err.message);
                } else {
                    res.status(500).send("Something went wrong");
                }
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
