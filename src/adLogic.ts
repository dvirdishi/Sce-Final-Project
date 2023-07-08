import {DetectedEntity} from './imageProccessor'
import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';
import * as NodeCache from 'node-cache';

 

const myCache = new NodeCache( { stdTTL: (60*60*24), checkperiod: (60*60*24) } );

let priorityTable: any = myCache.get( "priorityTable" );
if ( priorityTable == undefined ){
    const adPrioritiesPath = path.join(appRoot + '/src/configs/adPriorities.json');
    priorityTable = JSON.parse(fs.readFileSync(adPrioritiesPath, 'utf8'));
    myCache.set("priorityTable", priorityTable);
}

let adImagesTable: any = myCache.get("adImagesTable");
if (adImagesTable == undefined) {
    const adConfigPath = path.join(appRoot + '/src/configs/adConfig.json');
    adImagesTable = JSON.parse(fs.readFileSync(adConfigPath, 'utf8'));
    myCache.set("adImagesTable", adImagesTable);
}
else {
        // Update adImagesTable with modified data from adConfig.json
        const adConfigPath = path.join(appRoot + '/src/configs/adConfig.json');
        const updatedAdImagesTable = JSON.parse(fs.readFileSync(adConfigPath, 'utf8'));
        adImagesTable = updatedAdImagesTable;
    }


export default function adLogic(DetectedEntities: DetectedEntity[]): {gender:string, ageClass: string}{
    
    DetectedEntities.forEach((value, index)=> {

        priorityTable[value.ageClass].count++;
        if(value.gender == "male")
            priorityTable[value.ageClass].male++;
        else
            priorityTable[value.ageClass].female++;

    });

    let priorityArray:any[] = Object.values(priorityTable);
    let priorityArrayFiltered = priorityArray.filter((obj: any) => obj.count > 0);
    let sortedByCount = priorityArrayFiltered.sort((a:any, b:any) => (a.count > b.count) ? 1 : -1)

    //take the most common ageClass
    let winner = sortedByCount[sortedByCount.length - 1];

    let returnValue = {gender:'male', ageClass: winner.ageClass};

    if(winner.male > winner.female)
        returnValue.gender = 'male'
    else
        returnValue.gender = 'female'

    return returnValue;
}

export function getAdImage(gender:string, ageClass: string){
    let photosStack = adImagesTable[ageClass][gender];
    let randomAdPhoto = photosStack[Math.floor(Math.random() * photosStack.length)];
    return randomAdPhoto;
}