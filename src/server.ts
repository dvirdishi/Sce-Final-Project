import ImageProcessor from './imageProccessor';
import SocketHandler from './handlers/socketHandler';
import DbHandler from './handlers/dbHandler';


const appRoot = require('app-root-path');
const express = require('express');
const multer = require('multer');
var path = require('path');

import DbHelper from './dbHelper';

const upload = multer();

class Server {
    public http: any;
    public app: any;
    public port: number;
    public socketHandler: SocketHandler;
    private imageProcessor: ImageProcessor;
    constructor(port: number) {
        this.app = new express();
        this.port = port;
        this.http = require("http").Server(this.app);
        this.socketHandler = new SocketHandler(this.http);
        let dbHandler = new DbHandler();
        this.imageProcessor = new ImageProcessor();
        this.imageProcessor.subscribe(this.socketHandler);
        this.imageProcessor.subscribe(dbHandler);
        this.initApp();
    }

    private initApp() {

        // Parse URL-encoded bodies (as sent by HTML forms)
        this.app.use(express.urlencoded());

        // Parse JSON bodies (as sent by API clients)
        this.app.use(express.json());


        // Serve Static Assets
        // Virtual Path Prefix '/static'
        this.app.use('/public', express.static('public'))

        this.app.get('/', (req: any, res: any) => {
            // res.sendFile(path.join(__dirname + '/index.html'));
            res.sendFile(path.join(appRoot + '/public/index.html'));
        });

        this.app.get('/ad', (req: any, res: any) => {
            // res.sendFile(path.join(__dirname + '/index.html'));
            res.sendFile(path.join(appRoot + '/public/advertisementdisplay.html'));
        });

        this.app.post('/upload', upload.single('image'), async (req: any, res: any) => {
            if (req.file) {
              console.log("received image.");
          
              const imgWidth = parseInt(req.body.width);
              const imgHeight = parseInt(req.body.height);
          
              let result = this.imageProcessor.proccessImage(req.file, imgWidth, imgHeight);
          
              console.log("end /upload <-");
              res.sendStatus(200);
            } else {
              throw 'error';
            }
          });
          


        this.app.get('/getTodaysEntitiesCountPerAgeClass',async (req: any, res: any) => {
            
            let dbHelper = new DbHelper();
            
            let resData = await dbHelper.getTodaysEntitiesCountPerAgeClass();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });

        this.app.get('/getTodaysMaleFemaleNum',async (req: any, res: any) => {
            
            let dbHelper = new DbHelper();
            
            let resData = await dbHelper.getTodaysMaleFemaleNum();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });

        this.app.get('/getTodaysVistorsNum',async (req: any, res: any) => {
            
            let dbHelper = new DbHelper();
            
            let resData = await dbHelper.getTodaysVistorsNum();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });

        this.app.get('/getTodaysNumOfEntitiesByHour',async (req: any, res: any) => {
            
            let dbHelper = new DbHelper();
            
            let resData = await dbHelper.getTodaysNumOfEntitiesByHour();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });

        this.app.get('/getTrafficAbsoluteRatio',async (req: any, res: any) => {
            
            let dbHelper = new DbHelper();
            
            let resData = await dbHelper.getTrafficAbsoluteRatio();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resData, null, 3));
        });
    }

    public listen() {
        this.http.listen(this.port, () => {
            console.log('Listening at ' + this.port);
        });
    }
}

export default Server;