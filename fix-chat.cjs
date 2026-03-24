const fs = require('fs');
let content = fs.readFileSync('src/components/Chat.tsx', 'utf8');
content = content.replace(/<Button type="submit" disabled=\{\(!input\.trim\(\) && attachments\.length === 0\) \|\| isTyping\} size="icon" className="bg-\[#CC0000\] text-white flex-shrink-0 border-2 border-black\s*">/, '<Button type="submit" disabled={(!input.trim() && attachments.length === 0) || isTyping} size="icon" className="bg-[#CC0000] text-white flex-shrink-0 border-2 border-black hover:bg-red-700">');
fs.writeFileSync('src/components/Chat.tsx', content, 'utf8');
