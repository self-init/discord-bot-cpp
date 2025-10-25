const fs = require("node:fs");
const path = require("node:path");

function call(folderPath)  {
    let files = [];
    const folderContents = fs.readdirSync(folderPath);
    
    for (const obj of folderContents) {
        const objPath = path.join(folderPath, obj);

        if (fs.statSync(objPath).isDirectory()) {
            files = files.concat(call(objPath));
        } else {
            files.push(objPath);
        }
    }

    return files;
}

module.exports = call;