const fs = require("node:fs");
const path = require("node:path");


function load(folderPath, processor) {
    const folderContents = fs.readdirSync(folderPath);
    
    for (const obj of folderContents) {
        const objPath = path.join(folderPath, obj);

        if (fs.statSync(objPath).isDirectory()) {
            load(objPath, processor);
        } else {
            processor(require(objPath));
        }
    }
}

module.exports = {
    load: load
};