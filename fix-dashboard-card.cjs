const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
content = content.replace('bg-white border-2 border-black p-6 transition-all flex flex-col gap-4', 'bg-white border-2 border-black p-6 hover:bg-gray-50 transition-all flex flex-col gap-4');
fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
