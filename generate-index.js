const fs = require('fs');
const path = require('path');

const rootFolder = './docs';

function getAllSubdirectories(dir) {
    let subdirs = [];
    fs.readdirSync(dir).forEach(f => {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            subdirs.push(fullPath);
            subdirs = subdirs.concat(getAllSubdirectories(fullPath));
        }
    });
    return subdirs;
}

const allDirs = [rootFolder, ...getAllSubdirectories(rootFolder)];

allDirs.forEach(dir => {
    const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile()).filter(f => f.endsWith('.pdf'));
    const subdirs = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
    const relDir = path.relative(rootFolder, dir) || '.';
    let head = `
<head>
  <meta charset="UTF-8">
  <title>${relDir}</title>
</head>
`;
    let body = `
<body>
  <a href="../index.html">zurück</a>
  <h1>Inhalt des Ordners ${relDir}</h1>
  <ul>
`;

    // List files
    files.forEach(file => {
        // const filePath = path.join(relDir, file).replace(/\\/g, '/');
        const filePath = path.join(file).replace(/\\/g, '/');
        body += `    <li><a href="${filePath}" target="_blank">${file}</a></li>\n`;
    });

    // List subdirectories
    subdirs.forEach(subdir => {
        // const subdirPath = path.join(relDir, subdir).replace(/\\/g, '/');
        const subdirPath = path.join(subdir).replace(/\\/g, '/');
        body += `    <li><a href="${subdirPath}/index.html">${subdir}/</a></li>\n`;
    });

    body += `
  </ul>
</body>
`;

    let html = `
<!DOCTYPE html>
<html>
${head}
${body}
</html>
`;

    fs.writeFileSync(path.join(dir, 'index.html'), html);
    console.log(`index.html generated in ${dir}`);
});