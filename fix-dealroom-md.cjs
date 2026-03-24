const fs = require('fs');
let content = fs.readFileSync('src/pages/DealRoom.tsx', 'utf8');
content = content.replace('bg-white border-2 border-black md:', 'bg-white border-2 border-black');
fs.writeFileSync('src/pages/DealRoom.tsx', content, 'utf8');
