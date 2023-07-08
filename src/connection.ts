import { MongoClient, Collection, Db } from "mongodb";

export default class Connection {
    static connection:MongoClient;
    static db:Db;
   
    static url = 'mongodb+srv://dvirdishi:t5Jydy4cVlutlnOw@cluster0.elho4ao.mongodb.net/test';
    // static url = 'mongodb+srv://captain-hook:AcoolmongoDB1@detectionscluster-9wju5.mongodb.net/test?retryWrites=true&w=majority';
    // static url = 'mongodb://localhost:27017'
    static options = {
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    // or in the new async world
    static async connectToMongo() {
        if (this.db) return this.db
        this.connection = await MongoClient.connect(this.url, this.options);
        this.db = this.connection.db('detections_db');
        return this.db;
    }
}
