const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
content = content.replace('cursor-pointer  transition-all', 'cursor-pointer hover:bg-red-700 transition-all');
fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
