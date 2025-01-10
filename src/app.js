const express = require("express");
const connectMongoose = require("./config/mongoose");
const User = require("./models/user");
const useridmd = require("./middleware/userid");
const jwt = require("jsonwebtoken");
const { userValidation } = require("./utils/validation");

async function main() {
    try {
        // connect to database
        await connectMongoose();

        const app = express();

        // Parse JSON
        app.use(express.json());

        app.get('/user/:userID', useridmd, async(req, res) => {
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
        // Create a user
        app.post("/user", async(req, res) => {
            try {
                const user = req.body;
                const{name, email} = req.body;

                // Validation
                if (!userValidation(user)) {
                    return res.status(400).send({
                        msg: "Invalid credentials"
                    });
                }

                // Existing user check
                const existingUser = await User.findOne({
                    $or: [{ name }, { email }]
                });
                if(existingUser) return res.status(400).send({
                    msg: "Existing user"
                });
                const userModel = new User(user);
                await userModel.save();
                res.status(200).send("User created");
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    msg: "Unable to create user " + error
                });
            }
        })

        app.post("/login", async(req,res) => {
            const token = jwt.sign("address", process.env.JWT_SECRET);
            console.log(token);
            res.cookie(token);
            res.status(200).send({token});
        })

        // Unhandled error
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
