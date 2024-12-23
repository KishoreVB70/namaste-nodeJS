const http = require("node:http");

const server = http.createServer((req, res) => {
    res.end("Motorolla");
});

server.listen("7777");
