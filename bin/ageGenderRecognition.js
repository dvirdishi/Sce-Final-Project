"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgeGenderRecognition = void 0;
const faceapi = require("face-api.js");
const canvas_1 = require("canvas");
const commons_1 = require("./commons");
const tfnode = require("@tensorflow/tfjs-node");
const utils_1 = require("./utils");
commons_1.faceDetectionNet.loadFromDisk('weights');
faceapi.nets.faceLandmark68Net.loadFromDisk('weights');
faceapi.nets.ageGenderNet.loadFromDisk('weights');
class AgeGenderRecognition {
    static async recognizeAgeAndGender(imageBuffer, imageWidth, imageHeight) {
        let img = tfnode.node.decodeImage(imageBuffer);
        const results = await faceapi.detectAllFaces(img, commons_1.faceDetectionOptions)
            .withFaceLandmarks()
            .withAgeAndGender();
        let dims = { 'width': imageWidth, 'height': imageHeight };
        let myCanvas = faceapi.createCanvas(dims);
        const ctx = myCanvas.getContext('2d');
        const tempImg = new canvas_1.Image();
        tempImg.onload = () => ctx.drawImage(tempImg, 0, 0);
        tempImg.onerror = err => { throw err; };
        tempImg.src = imageBuffer;
        // const out = myCanvas as any;
        const out = myCanvas;
        faceapi.draw.drawDetections(out, results.map(res => res.detection));
        results.forEach(result => {
            const { age, gender, genderProbability } = result;
            new faceapi.draw.DrawTextField([
                `${(0, utils_1.ageToAgeClass)(faceapi.utils.round(age, 0))}`,
                `${gender}`
            ], result.detection.box.bottomLeft).draw(out);
        });
        let result = { outputCanvas: out, results: results };
        return result;
    }
}
exports.AgeGenderRecognition = AgeGenderRecognition;
//# sourceMappingURL=ageGenderRecognition.js.map