"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adLogic_1 = require("../adLogic");
const adLogic_2 = require("../adLogic");
class SocketHandler {
    constructor(server) {
        this.io = require("socket.io")(server);
    }
    update(proccessResult) {
        let imageBase64 = proccessResult.outputCanvas.toDataURL();
        let selectedComb = (0, adLogic_1.default)(proccessResult.detectedEntities);
        let selectedAdImage = (0, adLogic_2.getAdImage)(selectedComb.gender, selectedComb.ageClass);
        let responseData = {
            detectedEntities: proccessResult.detectedEntities,
            time: proccessResult.time,
            detectionImage: imageBase64,
            adImage: selectedAdImage
        };
        this.io.sockets.emit('stream', responseData);
    }
}
exports.default = SocketHandler;
//# sourceMappingURL=socketHandler.js.map