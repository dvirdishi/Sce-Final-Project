import { AgeGenderRecognition } from "./ageGenderRecognition";
import {ageToAgeClass} from './utils'
import { data } from "@tensorflow/tfjs-node";
const fs = require('fs');
const path = require('path');


export interface DetectedEntity{
    age:number, ageClass:string, gender:string, genderProbability:number
}

export interface ProccessResult {

    outputCanvas: HTMLCanvasElement;
    detectedEntities: DetectedEntity[];
    time: Date;
}

export interface ImageProccessorHandler {

    update(proccessResult: ProccessResult): void;

}

export default class ImageProcessor {

    private subscribers: ImageProccessorHandler[] = [];
    constructor() {
        
    }

   
    
    public async proccessImage(imageFile: any, imageWidth: number, imageHeight: number) {
      let result = await AgeGenderRecognition.recognizeAgeAndGender(imageFile.buffer, imageWidth, imageHeight);
      if (result.results.length > 0) {
        let detectedEntities = result.results.map((value, index) => {
          return {
            age: value.age,
            ageClass: ageToAgeClass(value.age),
            gender: value.gender.toString(),
            genderProbability: value.genderProbability
          };
        });
    
        let detectionResult: ProccessResult = {
          outputCanvas: result.outputCanvas,
          detectedEntities: detectedEntities,
          time: new Date()
        };
    
    
        this.notifySubscribers(detectionResult);
      }
    
      return result;
    }
    
    public subscribe(subscriber: ImageProccessorHandler) {
        this.subscribers.push(subscriber);
    }

    private notifySubscribers(proccessResult: ProccessResult) {

        this.subscribers.forEach(subscriber => {
            subscriber.update(proccessResult);
        });
    }

}