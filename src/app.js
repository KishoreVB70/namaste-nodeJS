const express = require("express");

const app = express();

app.use("/", (req, res) => {
    res.send("Hello world from server");
});

app.listen("3000", () => {
    console.log("Server up and runnin")
});