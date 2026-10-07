const fs = require('fs');
let code = fs.readFileSync('generate_docs.js', 'utf8');
code = code.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('generate_docs.js', code);
