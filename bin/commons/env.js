"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvas = void 0;
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
require("@tensorflow/tfjs-node");
const faceapi = require("face-api.js");
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const canvas = require('canvas');
exports.canvas = canvas;
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
//# sourceMappingURL=env.js.map