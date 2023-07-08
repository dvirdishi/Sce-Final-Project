import { ProccessResult } from "./imageProccessor";
import Connection from './connection';
import * as NodeCache from 'node-cache'; 
import {Collection} from "mongodb"

const myCache = new NodeCache( { stdTTL: 20, checkperiod: 30 } );

export interface Entity{
    age:number;
    ageClass:string;
    gender:string;
    genderProbability:number;
}

export interface DbDocument{

time:Date;
entities: Entity[];
}

export default class DbHelper {

    clientConnection: any;
    connection: any;

    constructor() {   
        
    }

async addDetection(proccessResult: ProccessResult): Promise<void> {
  console.log("DB helper update");

  let conn = await Connection.connectToMongo();

  const collection = conn.collection<DbDocument>("detections");

  const result = await collection.insertOne({ entities: proccessResult.detectedEntities, time: proccessResult.time } as DbDocument);

  console.log("inserted result:" + result.insertedId + " entities:" + proccessResult.detectedEntities)
}


    public async getTodaysEntitiesCountPerAgeClass() {

        let ageClassTable: any = {

            "Child": {ageClass: 'Child',male: 0, female: 0},
            "Teenager": {ageClass: 'Teenager',male: 0, female: 0},
            "Young Adult": {ageClass: 'Young Adult',male: 0, female: 0},
            "Early Adult": {ageClass: 'Early Adult',male: 0, female: 0},
            "Middle Adult": {ageClass: 'Middle Adult',male: 0, female: 0},
            "Late Adult": {ageClass: 'Late Adult',male: 0, female: 0},
            "Senior": {ageClass: 'Senior',male: 0, female: 0},
    
        }

        let docs = await this.getTodaysDocuments();

        docs.forEach((value,index)=>{
            for (const entity of value.entities) {
                ageClassTable[entity.ageClass][entity.gender]++;
            }
        });

        return ageClassTable;
    }

    public async getVisitorIncrease() {
        
    }


    public async getTodaysNumOfEntitiesByHour() {

        let docs = await this.getTodaysDocuments();

        let hourMap : Map<Number, any> = new Map();
        for (let hourNum = 0; hourNum < 24; hourNum++) {
            hourMap.set(hourNum, {hour: hourNum, male: 0, female :0});
        }
        
        docs.forEach((value,index)=>{
            
            let hourOfDetection = value.time.getHours();

            for (const entity of value.entities) {
                let curHourObj = hourMap.get(hourOfDetection);
                curHourObj[entity.gender]++;
                hourMap.set(hourOfDetection, curHourObj);
            }
        });
        let dupArr = new Array();

        hourMap.forEach((value,key) => {
            if(value.hour <= new Date().getHours()) 
            //TODO: check push order
            dupArr.push(value);
        } );
        
        return dupArr;
    }

    public async getTodaysMaleFemaleNum() : Promise<{male:number, female:number}> {

        let docs = await this.getTodaysDocuments();

        let maleSum = 0;
        let femaleSum = 0;
        for (const dbDocument of docs) {
            for (const entity of dbDocument.entities) {
                if(entity.gender == 'male')
                    maleSum++;
                else
                    femaleSum++;
            }
        }
        return {male: maleSum, female: femaleSum};
    }

    public async getTodaysVistorsNum() : Promise<number> {

        let docs = await this.getTodaysDocuments();

        let sum = 0;
        for (const dbDocument of docs) {
            sum += dbDocument.entities.length;
        }
        return sum;
    }


    public async getTodaysDocuments() : Promise<DbDocument[]> {

        //saving to cache
        let cachedData: any = myCache.get( "todaysDocuments" );
        if ( cachedData != undefined ){
            return cachedData;
        }

        let conn = await Connection.connectToMongo();
        const collection = conn.collection("detections");
        let beginingOfToday = new Date();
        beginingOfToday.setHours(0);
        beginingOfToday.setMinutes(0);
        beginingOfToday.setSeconds(0);
        let detectionsInLastDay = await collection.find({ time: { $gt: beginingOfToday } }).toArray() as any[];
        detectionsInLastDay = detectionsInLastDay.map((document) => ({ ...document, id: document._id }));

        myCache.set("todaysDocuments", detectionsInLastDay);
        
        return detectionsInLastDay;
    }

    private async getCollection() : Promise<Collection<any>> {
        let conn = await Connection.connectToMongo();
        return conn.collection("detections");
    }

    public async getTrafficAbsoluteRatio() : Promise<{sign : string, ratio: number, detectionsBeforeToday:number, detectionsToday: number}> {
        const collection = await this.getCollection();

        let beginingOfToday = new Date();
        beginingOfToday.setHours(0);
        beginingOfToday.setMinutes(0);
        beginingOfToday.setSeconds(0);

        let detectionsBeforeToday : number = await collection.countDocuments({time : {$lt : beginingOfToday}});
        let detectionsToday : number = await collection.countDocuments({time : {$gt : beginingOfToday}});

        if (detectionsBeforeToday == 0) {
            detectionsBeforeToday++;
        }

        if ( detectionsToday == 0) {
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
        else return {
            sign: '-',
            ratio: Math.abs(diff),
            detectionsBeforeToday: detectionsBeforeToday,
            detectionsToday: detectionsToday
        };
    }

}
