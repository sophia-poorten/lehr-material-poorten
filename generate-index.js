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
  <title>Lehrmaterial</title>
  <style>
    body {
      height: 100vh;
      font-family: Arial, sans-serif;
      background: linear-gradient(45deg, #e66465, #9198e5);
    }
    ul {
      margin: 0;
    }
    li {
      padding-left: 1em;
      margin-bottom: 0.5em;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 2em; 
      background: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
    }
    a {
      color: #333;
    }
    .directory {
      font-weight: bold;
      color:rgb(154, 154, 154);
      font-family: consolas, monospace;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 5px;
    }
</style>
</head>
`;
    let body = `
<body>
  <div class="container">
    <a href="../index.html">zurück</a>
    <h1>Inhalt des Ordners <span class="directory">${relDir}</span></h1>
    <ul style="list-style-type: '\\1F4C3';">
`;

    // List files
    files.forEach(file => {
        // const filePath = path.join(relDir, file).replace(/\\/g, '/');
        const filePath = path.join(file).replace(/\\/g, '/');
        body += `      <li><a href="${filePath}" target="_blank">${file}</a></li>\n`;
    });
    body += `
    </ul>
    <ul style="list-style-type: '\\1F4C1';">
`;
    // List subdirectories
    subdirs.forEach(subdir => {
        // const subdirPath = path.join(relDir, subdir).replace(/\\/g, '/');
        const subdirPath = path.join(subdir).replace(/\\/g, '/');
        body += `      <li><a href="${subdirPath}/index.html">${subdir}/</a></li>\n`;
    });

    body += `
    </ul>
  </div>
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