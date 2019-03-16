const express = require("express");
const helmet = require("helmet");
const zooRouter = require("./routers/zooRouter");

const server = express();

server.use(express.json());
server.use(helmet());
server.use("/api/zoos/", zooRouter);

module.exports = server;