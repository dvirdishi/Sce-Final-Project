"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commons_1 = require("../commons");
class FileSaveHandler {
    constructor() {
    }
    update(proccessResult) {
        let dateStr = (new Date()).toLocaleTimeString();
        (0, commons_1.saveFile)('ageAndGenderRecognition ' + dateStr + '.jpg', proccessResult.outputCanvas.toBuffer('image/jpeg'));
    }
}
exports.default = FileSaveHandler;
//# sourceMappingURL=fileSaveHandler.js.map