const express = require("express");
const helmet = require("helmet");

const server = express();
const zooRouter = require("./routers/zooRouter");
const bearRouter = require("./routers/bearRouter");

server.use(express.json());
server.use(helmet());
server.use("/api/zoos/", zooRouter);
server.use("/api/bears/", bearRouter);

module.exports = server;
