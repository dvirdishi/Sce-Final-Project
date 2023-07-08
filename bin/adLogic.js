"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdImage = void 0;
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: (60 * 60 * 24), checkperiod: (60 * 60 * 24) });
let priorityTable = myCache.get("priorityTable");
if (priorityTable == undefined) {
    const adPrioritiesPath = path.join(appRoot + '/src/configs/adPriorities.json');
    priorityTable = JSON.parse(fs.readFileSync(adPrioritiesPath, 'utf8'));
    myCache.set("priorityTable", priorityTable);
}
let adImagesTable = myCache.get("adImagesTable");
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
function adLogic(DetectedEntities) {
    DetectedEntities.forEach((value, index) => {
        priorityTable[value.ageClass].count++;
        if (value.gender == "male")
            priorityTable[value.ageClass].male++;
        else
            priorityTable[value.ageClass].female++;
    });
    let priorityArray = Object.values(priorityTable);
    let priorityArrayFiltered = priorityArray.filter((obj) => obj.count > 0);
    let sortedByCount = priorityArrayFiltered.sort((a, b) => (a.count > b.count) ? 1 : -1);
    //take the most common ageClass
    let winner = sortedByCount[sortedByCount.length - 1];
    let returnValue = { gender: 'male', ageClass: winner.ageClass };
    if (winner.male > winner.female)
        returnValue.gender = 'male';
    else
        returnValue.gender = 'female';
    return returnValue;
}
exports.default = adLogic;
function getAdImage(gender, ageClass) {
    let photosStack = adImagesTable[ageClass][gender];
    let randomAdPhoto = photosStack[Math.floor(Math.random() * photosStack.length)];
    return randomAdPhoto;
}
exports.getAdImage = getAdImage;
//# sourceMappingURL=adLogic.js.map