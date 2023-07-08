"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ageGenderRecognition_1 = require("./ageGenderRecognition");
const utils_1 = require("./utils");
const fs = require('fs');
const path = require('path');
class ImageProcessor {
    constructor() {
        this.subscribers = [];
    }
    async proccessImage(imageFile, imageWidth, imageHeight) {
        let result = await ageGenderRecognition_1.AgeGenderRecognition.recognizeAgeAndGender(imageFile.buffer, imageWidth, imageHeight);
        if (result.results.length > 0) {
            let detectedEntities = result.results.map((value, index) => {
                return {
                    age: value.age,
                    ageClass: (0, utils_1.ageToAgeClass)(value.age),
                    gender: value.gender.toString(),
                    genderProbability: value.genderProbability
                };
            });
            let detectionResult = {
                outputCanvas: result.outputCanvas,
                detectedEntities: detectedEntities,
                time: new Date()
            };
            this.notifySubscribers(detectionResult);
        }
        return result;
    }
    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }
    notifySubscribers(proccessResult) {
        this.subscribers.forEach(subscriber => {
            subscriber.update(proccessResult);
        });
    }
}
exports.default = ImageProcessor;
//# sourceMappingURL=imageProccessor.js.map