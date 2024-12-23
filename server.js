const http = require("node:http");

const server = http.createServer((req, res) => {
    if (req.url === "/bot") {
        res.end("Botesan");
    }
    res.end("Motorolla");
});

server.listen("7777");
