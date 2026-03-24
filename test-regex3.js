const cleanText = (input) => {
  if (!input) return input;
  let cleaned = input.replace(/<\|?thought\b[\s\S]*?(?:\|>|<\/\|?thought>)/g, '');
  cleaned = cleaned.replace(/<\|?thought\b[\s\S]*$/, '');
  return cleaned.trim();
};

console.log(cleanText("Start <|thought> thinking... </thought> End"));
