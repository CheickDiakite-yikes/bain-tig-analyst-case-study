const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const regexes = [
  /shadow-\[.*?rgba\((0,0,0|204,0,0),1\)\]/g,
  /md:shadow-\[.*?rgba\((0,0,0|204,0,0),1\)\]/g,
  /hover:shadow-\[.*?rgba\((0,0,0|204,0,0),1\)\]/g,
  /focus-visible:shadow-\[.*?rgba\((0,0,0|204,0,0),1\)\]/g,
  /active:shadow-none/g,
  /hover:translate-[xy]-\[[^\]]+\]/g,
  /active:translate-[xy]-\[[^\]]+\]/g,
  /focus-visible:translate-[xy]-\[[^\]]+\]/g
];

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    regexes.forEach(regex => {
      content = content.replace(regex, '');
    });
    
    // Clean up multiple spaces
    content = content.replace(/ +/g, ' ');
    // Clean up space before closing quote
    content = content.replace(/ "/g, '"');
    content = content.replace(/ '/g, "'");
    content = content.replace(/ }/g, '}');
    content = content.replace(/ >/g, '>');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
