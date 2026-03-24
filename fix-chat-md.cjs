const fs = require('fs');
let content = fs.readFileSync('src/components/Chat.tsx', 'utf8');
content = content.replace(/border-2 border-black md:"/g, 'border-2 border-black"');
fs.writeFileSync('src/components/Chat.tsx', content, 'utf8');
