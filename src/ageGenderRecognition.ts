import * as faceapi from 'face-api.js';
import { Image } from 'canvas';
import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';
import * as tfnode from '@tensorflow/tfjs-node';
import {ageToAgeClass} from './utils';
faceDetectionNet.loadFromDisk('weights')
faceapi.nets.faceLandmark68Net.loadFromDisk('weights')
faceapi.nets.ageGenderNet.loadFromDisk('weights')



export class AgeGenderRecognition {

    static async recognizeAgeAndGender(imageBuffer: any, imageWidth: number, imageHeight: number) {

        let img = tfnode.node.decodeImage(imageBuffer);

        const results = await faceapi.detectAllFaces(img as any, faceDetectionOptions)
            .withFaceLandmarks()
            .withAgeAndGender()

        let dims = { 'width': imageWidth, 'height': imageHeight };
        let myCanvas = faceapi.createCanvas(dims);
        const ctx = myCanvas.getContext('2d') as CanvasRenderingContext2D;
        const tempImg = new Image()
        tempImg.onload = () => ctx.drawImage(tempImg as any, 0, 0)
        tempImg.onerror = err => { throw err }
        tempImg.src = imageBuffer;

        // const out = myCanvas as any;
        const out = myCanvas;

        faceapi.draw.drawDetections(out, results.map(res => res.detection))
        results.forEach(result => {
            const { age, gender, genderProbability } = result
            new faceapi.draw.DrawTextField(
                [
                    `${ageToAgeClass(faceapi.utils.round(age, 0))}`,
                    `${gender}`
                ],
                result.detection.box.bottomLeft
            ).draw(out)
        })

        let result = { outputCanvas: out, results: results };

        return result;

    }

}