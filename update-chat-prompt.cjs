const fs = require('fs');
let content = fs.readFileSync('src/components/Chat.tsx', 'utf8');

// Replace NO INTERNAL MONOLOGUE instruction
content = content.replace(
  /5\. NO INTERNAL MONOLOGUE: Do NOT output your internal thinking, reasoning, or self-talk to the user.*?Only output the final, polished response to the user\./s,
  '5. REASONING & THOUGHTS: You are a reasoning model. You MUST wrap all of your internal thinking, reasoning, planning, and self-talk inside <think> and </think> tags. Never output your thoughts as regular text outside of these tags. The user will not see anything inside the <think> tags, so use them freely to plan your actions.'
);

// Make createMemo instruction more explicit
content = content.replace(
  /If asked to generate or draft a memo, use the createMemo tool\./,
  'If asked to generate or draft a memo, you MUST use the createMemo tool to save it to the database. DO NOT output the memo text directly in your chat response. The user will view the memo in a separate tab once you create it using the tool.'
);

fs.writeFileSync('src/components/Chat.tsx', content, 'utf8');
