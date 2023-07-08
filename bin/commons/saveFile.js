"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = void 0;
const fs = require("fs");
const path = require("path");
const baseDir = path.resolve(__dirname, '../out');
function saveFile(fileName, buf) {
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
    }
    fs.writeFileSync(path.resolve(baseDir, fileName), buf);
}
exports.saveFile = saveFile;
//# sourceMappingURL=saveFile.js.map