const cleanText = (input) => {
  if (!input) return input;
  let cleaned = input.replace(/<\|?thought\b[\s\S]*?(?:\|>|<\/\|?thought>)/g, '');
  cleaned = cleaned.replace(/<\|?thought\b[\s\S]*$/, '');
  return cleaned.trim();
};

const text1 = "Here is some text. <|thought The CIM analysis confirms: \n\n- Smarts Broadcast Systems is a legacy company\n- Proprietary Linux platform\n|> And here is the rest of the text.";
const text2 = "Start <|thought thinking... |> End";
const text3 = "Start <|thought thinking...";

console.log(cleanText(text1));
console.log(cleanText(text2));
console.log(cleanText(text3));
