const fs = require('fs');
let content = fs.readFileSync('src/components/FileUpload.tsx', 'utf8');
content = content.replace('bg-white  transition-all', 'bg-white hover:bg-gray-50 transition-all');
fs.writeFileSync('src/components/FileUpload.tsx', content, 'utf8');
