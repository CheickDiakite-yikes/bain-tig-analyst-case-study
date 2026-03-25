const cleanText = (input) => {
  if (!input) return input;
  let cleaned = input.replace(/<\|?(thought|think)\b[\s\S]*?(?:\|>|<\/\|?(thought|think)\s*>)/gi, '');
  cleaned = cleaned.replace(/<\|?(thought|think)\b[\s\S]*$/i, '');
  cleaned = cleaned.replace(/<\|?file_separator\|?>|\[file_separator\]/gi, '');
  cleaned = cleaned.replace(/If you need to [^,]+, use the [a-zA-Z0-9_]+ tool\.?/gi, '');
  cleaned = cleaned.replace(/If you are done, provide your final response\.?\s*\}?/gi, '');
  
  // Remove "Use the [tool] tool..." sentences
  cleaned = cleaned.replace(/(?:^|\n)\s*Use the [`'"]?[a-zA-Z0-9_]+[`'"]? tool[^.]*\.?/gi, '');
  
  cleaned = cleaned.trim();
  if (cleaned.toLowerCase() === 'use' || cleaned.toLowerCase() === 'use the' || cleaned.toLowerCase() === 'use the tool.') {
    return '';
  }
  
  return cleaned;
};

console.log("1:", cleanText("I will use the createMemo tool."));
console.log("2:", cleanText("Use the createMemo tool."));
console.log("3:", cleanText("Use the `createMemo` tool."));
console.log("4:", cleanText("Use"));
console.log("5:", cleanText("If you need to create a memo, use the createMemo tool. If you are done, provide your final response. } Use"));
