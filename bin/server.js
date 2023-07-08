"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageProccessor_1 = require("./imageProccessor");
const socketHandler_1 = require("./handlers/socketHandler");
const dbHandler_1 = require("./handlers/dbHandler");
const appRoot = require('app-root-path');
const express = require('express');
const multer = require('multer');
var path = require('path');
const dbHelper_1 = require("./dbHelper");
const upload = multer();
class Server {
    constructor(port) {
        this.app = new express();
        this.port = port;
        this.http = require("http").Server(this.app);
        this.socketHandler = new socketHandler_1.default(this.http);
        let dbHandler = new dbHandler_1.default();
        this.imageProcessor = new imageProccessor_1.default();
        this.imageProcessor.subscribe(this.socketHandler);
        this.imageProcessor.subscribe(dbHandler);
        this.initApp();
    }
    initApp() {
        // Parse URL-encoded bodies (as sent by HTML forms)
        this.app.use(express.urlencoded());
        // Parse JSON bodies (as sent by API clients)
        this.app.use(express.json());
        // Serve Static Assets
        // Virtual Path Prefix '/static'
        this.app.use('/public', express.static('public'));
        this.app.get('/', (req, res) => {
            // res.sendFile(path.join(__dirname + '/index.html'));
            res.sendFile(path.join(appRoot + '/public/index.html'));
        });
        this.app.get('/ad', (req, res) => {
            // res.sendFile(path.join(__dirname + '/index.html'));
            res.sendFile(path.join(appRoot + '/public/advertisementdisplay.html'));
        });
        this.app.post('/upload', upload.single('image'), async (req, res) => {
            if (req.file) {
                console.log("received image.");
                const imgWidth = parseInt(req.body.width);
                const imgHeight = parseInt(req.body.height);
                let result = this.imageProcessor.proccessImage(req.file, imgWidth, imgHeight);
                console.log("end /upload <-");
                res.sendStatus(200);
            }
            else {
                throw 'error';
            }
        });
        this.app.get('/getTodaysEntitiesCountPerAgeClass', async (req, res) => {
            let dbHelper = new dbHelper_1.default();
            let resData = await dbHelper.getTodaysEntitiesCountPerAgeClass();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });
        this.app.get('/getTodaysMaleFemaleNum', async (req, res) => {
            let dbHelper = new dbHelper_1.default();
            let resData = await dbHelper.getTodaysMaleFemaleNum();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });
        this.app.get('/getTodaysVistorsNum', async (req, res) => {
            let dbHelper = new dbHelper_1.default();
            let resData = await dbHelper.getTodaysVistorsNum();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });
        this.app.get('/getTodaysNumOfEntitiesByHour', async (req, res) => {
            let dbHelper = new dbHelper_1.default();
            let resData = await dbHelper.getTodaysNumOfEntitiesByHour();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });
        this.app.get('/getTrafficAbsoluteRatio', async (req, res) => {
            let dbHelper = new dbHelper_1.default();
            let resData = await dbHelper.getTrafficAbsoluteRatio();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });
    }
    listen() {
        this.http.listen(this.port, () => {
            console.log('Listening at ' + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map