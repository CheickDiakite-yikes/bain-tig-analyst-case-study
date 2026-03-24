const text = "Here is some text. <|thought The CIM analysis confirms: \n\n- Smarts Broadcast Systems is a legacy company\n- Proprietary Linux platform\n|> And here is the rest of the text.";

function cleanText(input) {
  // Remove completed thought blocks
  let cleaned = input.replace(/<\|thought[\s\S]*?\|>/g, '');
  // Remove incomplete thought block at the end
  cleaned = cleaned.replace(/<\|thought[\s\S]*$/, '');
  return cleaned;
}

console.log(cleanText(text));
