import { ProccessResult, ImageProccessorHandler } from '../imageProccessor'

import DbHelper from '../dbHelper';

export default class DbHandler implements ImageProccessorHandler {

    helper : DbHelper

    constructor() {
        this.helper = new DbHelper()
    }

    update(proccessResult: ProccessResult): void {
        this.helper.addDetection(proccessResult);
    }
}