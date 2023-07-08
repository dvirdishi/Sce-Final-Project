"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceDetectionOptions = exports.faceDetectionNet = void 0;
const faceapi = require("face-api.js");
exports.faceDetectionNet = faceapi.nets.ssdMobilenetv1;
// export const faceDetectionNet = tinyFaceDetector
// SsdMobilenetv1Options
const minConfidence = 0.5;
// TinyFaceDetectorOptions
const inputSize = 408;
const scoreThreshold = 0.5;
function getFaceDetectorOptions(net) {
    return net === faceapi.nets.ssdMobilenetv1
        ? new faceapi.SsdMobilenetv1Options({ minConfidence })
        : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}
exports.faceDetectionOptions = getFaceDetectorOptions(exports.faceDetectionNet);
//# sourceMappingURL=faceDetection.js.map