import { saveFile } from '../commons';
import { ProccessResult, ImageProccessorHandler } from '../imageProccessor'

export default class FileSaveHandler implements ImageProccessorHandler {
    constructor() {

    }

    update(proccessResult: ProccessResult): void {
        let dateStr = (new Date()).toLocaleTimeString();
        saveFile('ageAndGenderRecognition '+dateStr+'.jpg', (proccessResult.outputCanvas as any).toBuffer('image/jpeg'))
    }
}