import { ProccessResult, ImageProccessorHandler } from '../imageProccessor'
import adLogic from '../adLogic'
import {getAdImage} from '../adLogic'

export default class SocketHandler implements ImageProccessorHandler {

    private io:SocketIO.Server;
    constructor(server: any) {
        this.io = require("socket.io")(server);
    }
    update(proccessResult: ProccessResult): void {
        let imageBase64 = proccessResult.outputCanvas.toDataURL();

        let selectedComb = adLogic(proccessResult.detectedEntities);

        let selectedAdImage = getAdImage(selectedComb.gender,selectedComb.ageClass);
        let responseData = {
            detectedEntities: proccessResult.detectedEntities,
            time: proccessResult.time,
            detectionImage: imageBase64,
            adImage: selectedAdImage
        }

        this.io.sockets.emit('stream', responseData);
    }



}