const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');
content = content.replace('border-black  transition-all', 'border-black hover:bg-red-700 transition-all');
fs.writeFileSync('src/pages/Login.tsx', content, 'utf8');
