const fs = require('fs');
let content = fs.readFileSync('src/components/TaskBoard.tsx', 'utf8');
content = content.replace('cursor-move  transition-all', 'cursor-move hover:bg-gray-50 transition-all');
fs.writeFileSync('src/components/TaskBoard.tsx', content, 'utf8');
