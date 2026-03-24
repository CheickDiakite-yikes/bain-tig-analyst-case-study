const fs = require('fs');
let content = fs.readFileSync('src/components/TaskModal.tsx', 'utf8');
content = content.replace('border-black  transition-all', 'border-black hover:bg-red-700 transition-all');
fs.writeFileSync('src/components/TaskModal.tsx', content, 'utf8');
