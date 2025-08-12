const fs = require('fs');
const path = require('path');

function deleteIndexFiles(dir) {
    fs.readdirSync(dir).forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            deleteIndexFiles(fullPath);
        } else if (stat.isFile() && item === 'index.html') {
            fs.unlinkSync(fullPath);
            console.log(`Deleted: ${fullPath}`);
        }
    });
}

deleteIndexFiles(process.cwd());
console.log('All index.html files deleted.');