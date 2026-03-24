const fs = require('fs');
let content = fs.readFileSync('src/components/Chat.tsx', 'utf8');

content = content.replace(
  /5\. REASONING & THOUGHTS: You are a reasoning model.*?plan your actions\./s,
  '5. REASONING & THOUGHTS: You are a reasoning model. You MUST wrap all of your internal thinking, reasoning, planning, and self-talk inside <think> and </think> tags. Never output your thoughts as regular text outside of these tags. The user will not see anything inside the <think> tags, so use them freely to plan your actions. CRITICAL: DO NOT output conversational filler like "Wait, I should check...", "Let me think...", or "I will output this now." outside of the <think> tags. Your text output must ONLY be the final, polished response to the user.'
);

fs.writeFileSync('src/components/Chat.tsx', content, 'utf8');
