"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const connection_1 = require("./connection");
connection_1.default.connectToMongo();
const server = new server_1.default(3003);
server.listen();
//# sourceMappingURL=index.js.map