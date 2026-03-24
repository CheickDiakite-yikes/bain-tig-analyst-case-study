const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = content.replace(/hover:\s*"/g, '"');
    content = content.replace(/hover:\s*'/g, "'");
    content = content.replace(/hover:\s*`/g, "`");
    content = content.replace(/hover:\s+/g, ' ');
    content = content.replace(/md:\s+/g, ' ');
    content = content.replace(/active:\s+/g, ' ');
    content = content.replace(/focus-visible:\s+/g, ' ');
    
    // Also replace hover: at the end of a string
    content = content.replace(/hover:"/g, '"');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed dangling modifiers in', filePath);
    }
  }
});
