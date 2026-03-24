const fs = require('fs');
let content = fs.readFileSync('src/pages/DealRoom.tsx', 'utf8');
content = content.replace('duration-300 md:"', 'duration-300"');
fs.writeFileSync('src/pages/DealRoom.tsx', content, 'utf8');
