"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Connection {
    // or in the new async world
    static async connectToMongo() {
        if (this.db)
            return this.db;
        this.connection = await mongodb_1.MongoClient.connect(this.url, this.options);
        this.db = this.connection.db('detections_db');
        return this.db;
    }
}
exports.default = Connection;
Connection.url = 'mongodb+srv://dvirdishi:t5Jydy4cVlutlnOw@cluster0.elho4ao.mongodb.net/test';//mongoconnect
Connection.options = {
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};
//# sourceMappingURL=connection.js.map