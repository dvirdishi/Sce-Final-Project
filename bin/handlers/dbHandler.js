"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbHelper_1 = require("../dbHelper");
class DbHandler {
    constructor() {
        this.helper = new dbHelper_1.default();
    }
    update(proccessResult) {
        this.helper.addDetection(proccessResult);
    }
}
exports.default = DbHandler;
//# sourceMappingURL=dbHandler.js.map