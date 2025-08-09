// generate-index.js
const fs = require('fs');
const path = require('path');

const docsFolder = './docs';
const files = fs.readdirSync(docsFolder).filter(f => f.endsWith('.pdf'));

let head = `
<head>
  <meta charset="UTF-8">
  <title>PDF Index</title>
</head>
`

let body = `
<body>
  <h1>Available PDFs</h1>
  <ul>
`;

files.forEach(file => {
    body += `    <li><a href="docs/${file}" target="_blank">${file}</a></li>\n`;
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
`


fs.writeFileSync('index.html', html);
console.log('index.html generated!');
