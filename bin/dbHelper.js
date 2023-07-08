"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 20, checkperiod: 30 });
class DbHelper {
    constructor() {
    }
    async addDetection(proccessResult) {
        console.log("DB helper update");
        let conn = await connection_1.default.connectToMongo();
        const collection = conn.collection("detections");
        const result = await collection.insertOne({ entities: proccessResult.detectedEntities, time: proccessResult.time });
        console.log("inserted result:" + result.insertedId + " entities:" + proccessResult.detectedEntities);
    }
    async getTodaysEntitiesCountPerAgeClass() {
        let ageClassTable = {
            "Child": { ageClass: 'Child', male: 0, female: 0 },
            "Teenager": { ageClass: 'Teenager', male: 0, female: 0 },
            "Young Adult": { ageClass: 'Young Adult', male: 0, female: 0 },
            "Early Adult": { ageClass: 'Early Adult', male: 0, female: 0 },
            "Middle Adult": { ageClass: 'Middle Adult', male: 0, female: 0 },
            "Late Adult": { ageClass: 'Late Adult', male: 0, female: 0 },
            "Senior": { ageClass: 'Senior', male: 0, female: 0 },
        };
        let docs = await this.getTodaysDocuments();
        docs.forEach((value, index) => {
            for (const entity of value.entities) {
                ageClassTable[entity.ageClass][entity.gender]++;
            }
        });
        return ageClassTable;
    }
    async getVisitorIncrease() {
    }
    async getTodaysNumOfEntitiesByHour() {
        let docs = await this.getTodaysDocuments();
        let hourMap = new Map();
        for (let hourNum = 0; hourNum < 24; hourNum++) {
            hourMap.set(hourNum, { hour: hourNum, male: 0, female: 0 });
        }
        docs.forEach((value, index) => {
            let hourOfDetection = value.time.getHours();
            for (const entity of value.entities) {
                let curHourObj = hourMap.get(hourOfDetection);
                curHourObj[entity.gender]++;
                hourMap.set(hourOfDetection, curHourObj);
            }
        });
        let dupArr = new Array();
        hourMap.forEach((value, key) => {
            if (value.hour <= new Date().getHours())
                //TODO: check push order
                dupArr.push(value);
        });
        return dupArr;
    }
    async getTodaysMaleFemaleNum() {
        let docs = await this.getTodaysDocuments();
        let maleSum = 0;
        let femaleSum = 0;
        for (const dbDocument of docs) {
            for (const entity of dbDocument.entities) {
                if (entity.gender == 'male')
                    maleSum++;
                else
                    femaleSum++;
            }
        }
        return { male: maleSum, female: femaleSum };
    }
    async getTodaysVistorsNum() {
        let docs = await this.getTodaysDocuments();
        let sum = 0;
        for (const dbDocument of docs) {
            sum += dbDocument.entities.length;
        }
        return sum;
    }
    async getTodaysDocuments() {
        //saving to cache
        let cachedData = myCache.get("todaysDocuments");
        if (cachedData != undefined) {
            return cachedData;
        }
        let conn = await connection_1.default.connectToMongo();
        const collection = conn.collection("detections");
        let beginingOfToday = new Date();
        beginingOfToday.setHours(0);
        beginingOfToday.setMinutes(0);
        beginingOfToday.setSeconds(0);
        let detectionsInLastDay = await collection.find({ time: { $gt: beginingOfToday } }).toArray();
        detectionsInLastDay = detectionsInLastDay.map((document) => (Object.assign(Object.assign({}, document), { id: document._id })));
        myCache.set("todaysDocuments", detectionsInLastDay);
        return detectionsInLastDay;
    }
    async getCollection() {
        let conn = await connection_1.default.connectToMongo();
        return conn.collection("detections");
    }
    async getTrafficAbsoluteRatio() {
        const collection = await this.getCollection();
        let beginingOfToday = new Date();
        beginingOfToday.setHours(0);
        beginingOfToday.setMinutes(0);
        beginingOfToday.setSeconds(0);
        let detectionsBeforeToday = await collection.countDocuments({ time: { $lt: beginingOfToday } });
        let detectionsToday = await collection.countDocuments({ time: { $gt: beginingOfToday } });
        if (detectionsBeforeToday == 0) {
            detectionsBeforeToday++;
        }
        if (detectionsToday == 0) {
            detectionsToday++;
        }
        let v1 = detectionsBeforeToday;
        let v2 = detectionsToday;
        let diff = Math.round(((v2 - v1) / Math.abs(v1)) * 100);
        if (diff >= 0) {
            return {
                sign: '+',
                ratio: diff,
                detectionsBeforeToday: detectionsBeforeToday,
                detectionsToday: detectionsToday
            };
        }
        else
            return {
                sign: '-',
                ratio: Math.abs(diff),
                detectionsBeforeToday: detectionsBeforeToday,
                detectionsToday: detectionsToday
            };
    }
}
exports.default = DbHelper;
//# sourceMappingURL=dbHelper.js.map