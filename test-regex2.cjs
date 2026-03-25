const text = "If you need to generate images, use the generateImage tool. If you need to create a memo, use the createMemo tool. If you are done, provide your final response.";
let cleaned = text;
cleaned = cleaned.replace(/If you need to [^,]+, use the [a-zA-Z0-9_]+ tool\.?/gi, '');
cleaned = cleaned.replace(/If you are done, provide your final response\.?\s*\}?/gi, '');
console.log("CLEANED:", JSON.stringify(cleaned));
