import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, getBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { User } from 'firebase/auth';
import { GoogleGenAI, ThinkingLevel, FunctionDeclaration, Type } from '@google/genai';
import { Send, BrainCircuit, Loader2, FileText, Sparkles, User as UserIcon, X, MessageSquare, Paperclip, XCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const cleanText = (input: string) => {
  if (!input) return input;
  // Remove completed thought/think blocks
  let cleaned = input.replace(/<\|?(thought|think)\b[\s\S]*?(?:\|>|<\/\|?(thought|think)\s*>)/gi, '');
  // Remove incomplete thought/think block at the end
  cleaned = cleaned.replace(/<\|?(thought|think)\b[\s\S]*$/i, '');
  return cleaned.trim();
};

export default function Chat({ deal, dealId, user, files, memos, tasks, onClose, initialInput }: { deal: any, dealId: string, user: User, files: any[], memos?: any[], tasks?: any[], onClose: () => void, initialInput?: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState(initialInput || '');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [loadingStage, setLoadingStage] = useState<string>('Thinking...');
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [attachments, setAttachments] = useState<{name: string, mimeType: string, data: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialInput) {
      setInput(initialInput);
    }
  }, [initialInput]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(m => m.dealId === dealId);
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [dealId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setAttachments(prev => [...prev, { name: file.name, mimeType: file.type, data: base64 }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isTyping) return;

    const userMsg = input;
    const currentAttachments = [...attachments];
    setInput('');
    setAttachments([]);
    setIsTyping(true);
    setLoadingStage('Analyzing request...');

    const stages = [
      'Reviewing data room files...',
      'Cross-referencing context...',
      'Synthesizing insights...',
      'Formulating response...'
    ];
    let stageIndex = 0;
    loadingIntervalRef.current = setInterval(() => {
      if (stageIndex < stages.length) {
        setLoadingStage(stages[stageIndex]);
        stageIndex++;
      }
    }, 2500);

    try {
      // Save user message
      let displayContent = userMsg;
      if (currentAttachments.length > 0) {
        displayContent += `\n\n[Attached: ${currentAttachments.map(a => a.name).join(', ')}]`;
      }

      await addDoc(collection(db, 'messages'), {
        dealId,
        role: 'user',
        content: displayContent,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });

      // Prepare context
      const fileContext = files.length > 0 
        ? `\n\nData Room Files Available:\n${files.map(f => `- ID: ${f.id}, Name: ${f.name} (${f.type})`).join('\n')}`
        : '\n\nNo files currently in the Data Room.';
      
      const memoContext = memos && memos.length > 0
        ? `\n\nExisting Memos:\n${memos.map(m => `- ID: ${m.id}, Title: ${m.title}`).join('\n')}`
        : '\n\nNo existing memos.';

      const taskContext = tasks && tasks.length > 0
        ? `\n\nExisting Tasks:\n${tasks.map(t => `- ID: ${t.id}, Title: ${t.title}, Status: ${t.status}, Priority: ${t.priority}, Assigned To: ${t.assignedTo || 'Unassigned'}`).join('\n')}`
        : '\n\nNo existing tasks.';

      const dealContext = `\n\nDeal Information:\n- Name: ${deal.name}\n- Target: ${deal.targetCompany}\n- EV: $${deal.ev}M\n- Status: ${deal.status}\n- AI Persistent Memory: ${deal.aiMemory || 'None yet.'}`;

      const systemInstruction = `You are a Senior Partner and expert Private Equity Tech Due Diligence Analyst at Bain & Company. 
Your goal is to assist the consultant with analyzing tech stacks, evaluating software architecture, identifying technical debt, and assessing the target company's engineering team.

CRITICAL INSTRUCTIONS FOR YOUR ANALYSIS AND MEMOS:
1. ACT LIKE A BAIN CONSULTANT: Do not just summarize facts. You must provide strong, professional opinions, judgments, and strategic recommendations. Use the Minto Pyramid Principle (Answer First communication). Be highly analytical, authoritative, and MECE (Mutually Exclusive, Collectively Exhaustive).
2. DEEP RESEARCH: You MUST use the googleSearch tool extensively to perform deep, current research online. Benchmark the target company's technology against industry standards, competitors, and current market trends. Do not rely solely on the provided documents; enrich your analysis with real-world data and context.
3. EXTENSIVE DETAIL & LENGTH: Your analysis and memos MUST be extremely detailed, spanning several pages of deep, rigorous content. You MUST write at least 3-4 substantial paragraphs for EVERY section in the memo framework. Do not use brief bullet points as a substitute for deep paragraph-form analysis. Break down complex technical concepts into business impact (e.g., how technical debt affects EBITDA or time-to-market). Provide State-of-the-Art (SOTA) technical software advice.
4. VISUAL EXCELLENCE (MULTIPLE IMAGES REQUIRED): You MUST use the generateImage tool MULTIPLE TIMES per report to create and embed relevant, high-quality images. Every memo MUST include at least:
   - A "Current State Architecture" diagram.
   - A "Proposed Future State (SOTA) Architecture" diagram.
   - A "Tech Stack" visual or "Remediation Cost" chart.
   Embed these generated markdown image links directly into the relevant sections of your memo.
5. NO INTERNAL MONOLOGUE: Do NOT output your internal thinking, reasoning, or self-talk to the user (e.g., "Wait, I should check...", "Let's go. I'll generate..."). If you need to use a tool, just call it directly without announcing it. Only output the final, polished response to the user.
6. DO NOT OVER-GENERATE: Only create a memo if explicitly asked to draft or create one. If the user asks you to create tasks, ONLY create tasks. Do not re-draft or create a new memo unless specifically requested.

When asked to generate or draft a Tech Due Diligence (Tech DD) memo, you MUST use the following highly structured framework. Output the memo using these exact headers, pulling context from the Data Room files AND your deep online research:

1. Executive Summary & Investment Thesis Alignment
- The Bottom Line: A high-level assessment of whether the technology is an asset or a liability. Provide a nuanced view, not just a binary answer.
- Key Risks & Red Flags: The top 3-5 critical issues that could kill the deal or require immediate post-close capital (e.g., critical security vulnerabilities, severe scaling bottlenecks). Explain the *business impact* of each risk in detail.
- Thesis Alignment: Does the current tech stack support the buyer's growth plan? Analyze the gap between current capabilities and future needs.
- Remediation Costs (CapEx/OpEx): High-level estimates of what it will cost to fix the identified gaps. Provide a breakdown of these costs and the expected ROI.

2. Product Strategy & Roadmap
- Current State of Product: Assessment of the current software suite, UI/UX, and core capabilities. Include specific examples of strengths and weaknesses.
- Roadmap Viability: Is the product roadmap realistic based on historical delivery velocity? Analyze the team's ability to execute on the roadmap.
- R&D Efficiency: How well does the engineering team translate business requirements into shipped features? Provide metrics or specific examples if possible.

3. Architecture & Infrastructure
- System Architecture: Is it a legacy monolith or modern microservices? Is it brittle or flexible? Provide a deep dive into the architectural patterns used and their implications.
- Scalability & Performance: Can the infrastructure handle the anticipated user or data volume over the holding period (typically 3–5 years)? Analyze potential bottlenecks and required upgrades.
- Technical Debt: Identification of shortcuts taken in the past that now slow down development or create instability. Quantify the debt if possible (e.g., estimated refactoring time).
- Cloud Maturity: Assessment of cloud hosting (AWS, Azure, GCP), cost-efficiency, and disaster recovery / high availability. Evaluate their use of cloud-native services vs. lift-and-shift.

4. Software Engineering & Code Quality (SDLC)
- Development Methodology: Agile/Scrum maturity. Analyze how their process impacts delivery speed and quality.
- CI/CD & Automation: How automated is their testing and deployment? (High automation = faster feature releases and fewer bugs). Detail the specific tools and practices used.
- Code Quality & Open Source Risk: Assessment of code maintainability and any licensing risks from Open Source Software (OSS) embedded in the proprietary code. Discuss the potential legal and technical ramifications.

5. Team & Organization
- Leadership Capability: Assessment of the CTO/VP of Engineering. Are they the right fit for the next phase of scale? Analyze their past experience and current performance.
- Key Person Dependency: Is the entire system knowledge locked in the head of one original architect? Detail the risks and propose mitigation strategies.
- Team Structure: Ratio of developers to QA/DevOps, and the onshore vs. offshore mix. Evaluate if the structure is optimized for their goals.

6. Cybersecurity & Data Privacy
- Security Posture: Infrastructure security, application security (AppSec), and endpoint protection. Provide a detailed analysis of their security practices and potential vulnerabilities.
- Compliance & Privacy: Adherence to standard frameworks (SOC 2, ISO 27001) and data privacy laws (GDPR, CCPA, HIPAA). Discuss the business risks of non-compliance.
- Incident History: Review of past breaches and the maturity of their incident response plans. Analyze their ability to detect and recover from incidents.

7. Corporate IT & Internal Systems
- Business Applications: Evaluation of internal tools (ERP, CRM, HRIS). Will they need to be ripped and replaced to support scale? Analyze the integration between these systems.
- Vendor Lock-in: Are they overly dependent on a specific third-party vendor with unfavorable contract terms? Detail the risks and potential exit strategies.

8. Tech Financials & Spend
- IT Budget Review: Is the current IT/Engineering spend aligned with industry benchmarks? Analyze the efficiency of their spend.
- Future Spend: What investments (headcount, software, cloud infrastructure) are required to hit the investment thesis goals? Provide a detailed forecast of required investments.

9. AI Disruption & Defensibility (Futuristic Moat Analysis)
- Agentic Replicability ("Vibe Code" Risk) [Score: 1-10]: Evaluation of how easily a lean team using top-tier AI coding agents could replicate the core software from scratch. (10 = Trivial to replicate via AI, 1 = Impossible due to deep proprietary complexity). Provide a detailed justification for the score.
- AI Obsolescence Risk [Score: 1-10]: The risk of the software's core value proposition being entirely replaced by autonomous AI agents or foundational models. (10 = Highly likely to be replaced, 1 = Highly insulated). Provide a detailed justification for the score.
- Futuristic Moats & Defensibility: Analysis of non-code barriers to entry that mitigate AI risk. Does the company possess physical infrastructure, proprietary datasets, hardware/chips, massive distribution networks, regulatory capture, or deep ecosystem lock-in that AI alone cannot easily replicate? Provide specific examples.
- Overall AI Resilience Assessment: A synthesized conclusion on whether the target's technology is future-proof against the rapid advancement of AI. Provide actionable recommendations for improving resilience.

If asked to generate or draft a memo, use the createMemo tool. If asked to update a memo, you MUST first use the readMemo tool to fetch its current content, and then use the updateMemo tool to apply the changes.
If asked to create a task, use the createTask tool. If asked to update a task's status or priority, use the updateTask tool. If asked to delete a task, use the deleteTask tool.
If asked to analyze, summarize, or extract data from a file in the Data Room, use the analyzeDataRoomFile tool.
Use the updateDealMemory tool to save important context, summaries, or facts about this deal that you should remember across multiple interactions.${dealContext}${fileContext}${memoContext}${taskContext}`;

      const modelName = thinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';

      const analyzeDataRoomFileFunction: FunctionDeclaration = {
        name: "analyzeDataRoomFile",
        description: "Fetch and analyze the content of a file from the Data Room.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            fileId: { type: Type.STRING, description: "The ID of the file to analyze." }
          },
          required: ["fileId"]
        }
      };

      const updateDealMemoryFunction: FunctionDeclaration = {
        name: "updateDealMemory",
        description: "Update the AI's persistent memory for this deal. Use this to store key facts, summaries, or context that should be remembered across the entire deal cycle.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            memory: { type: Type.STRING, description: "The updated memory content. This will overwrite the existing memory, so include all important past context as well as new insights." }
          },
          required: ["memory"]
        }
      };

      const createMemoFunction: FunctionDeclaration = {
        name: "createMemo",
        description: "Create a new memo in the database. ONLY use this when explicitly asked to draft or create a memo. Do not use this when asked to create tasks.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the memo." },
            content: { type: Type.STRING, description: "The full markdown content of the memo." }
          },
          required: ["title", "content"]
        }
      };

      const readMemoFunction: FunctionDeclaration = {
        name: "readMemo",
        description: "Read the full content of an existing memo. Use this before updating a memo to ensure you have the current content.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            memoId: { type: Type.STRING, description: "The ID of the memo to read." }
          },
          required: ["memoId"]
        }
      };

      const updateMemoFunction: FunctionDeclaration = {
        name: "updateMemo",
        description: "Update an existing memo in the database.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            memoId: { type: Type.STRING, description: "The ID of the memo to update." },
            title: { type: Type.STRING, description: "The updated title of the memo." },
            content: { type: Type.STRING, description: "The updated full markdown content of the memo." }
          },
          required: ["memoId", "title", "content"]
        }
      };

      const createTaskFunction: FunctionDeclaration = {
        name: "createTask",
        description: "Create a new due diligence task.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the task." },
            description: { type: Type.STRING, description: "The description of the task." },
            priority: { type: Type.STRING, description: "The priority of the task ('low', 'medium', 'high')." },
            assignedTo: { type: Type.STRING, description: "The person or entity assigned to the task (e.g., 'AI Analyst', 'Consultant')." }
          },
          required: ["title", "priority"]
        }
      };

      const updateTaskFunction: FunctionDeclaration = {
        name: "updateTask",
        description: "Update an existing due diligence task.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            taskId: { type: Type.STRING, description: "The ID of the task to update." },
            status: { type: Type.STRING, description: "The updated status of the task ('todo', 'in-progress', 'done')." },
            priority: { type: Type.STRING, description: "The updated priority of the task ('low', 'medium', 'high')." }
          },
          required: ["taskId"]
        }
      };

      const deleteTaskFunction: FunctionDeclaration = {
        name: "deleteTask",
        description: "Delete an existing due diligence task.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            taskId: { type: Type.STRING, description: "The ID of the task to delete." }
          },
          required: ["taskId"]
        }
      };

      const updateDealFunction: FunctionDeclaration = {
        name: "updateDeal",
        description: "Update the details of the current deal, such as its name, target company, enterprise value (EV), or status.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The updated name of the deal." },
            targetCompany: { type: Type.STRING, description: "The updated target company name." },
            ev: { type: Type.NUMBER, description: "The updated enterprise value (EV) in millions." },
            status: { type: Type.STRING, description: "The updated status of the deal (e.g., sourcing, diligence, closed, passed)." }
          }
        }
      };

      const generateImageFunction: FunctionDeclaration = {
        name: "generateImage",
        description: "Generate a professional, high-quality image, chart, or architecture diagram to include in the memo. Returns a markdown image link.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING, description: "Detailed prompt for the image generation. Specify that it should look like a professional Bain & Company consulting slide, chart, or architecture diagram." },
            imageSize: { type: Type.STRING, description: "Optional. The size of the generated image. Supported values: '512px', '1K', '2K', '4K'. Default is '1K'." },
            aspectRatio: { type: Type.STRING, description: "Optional. The aspect ratio of the generated image. Supported values: '1:1', '3:4', '4:3', '9:16', '16:9', '1:4', '1:8', '4:1', '8:1'. Default is '1:1'." }
          },
          required: ["prompt"]
        }
      };

      // Format history for Gemini API
      const historyContents: any[] = messages
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));

      // Current turn input
      const currentParts: any[] = [];
      if (userMsg) currentParts.push({ text: userMsg });
      currentAttachments.forEach(att => {
        currentParts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      });

      historyContents.push({ role: 'user', parts: currentParts });

      let responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: historyContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4,
          maxOutputTokens: 65536,
          tools: [{ googleSearch: {} }, { functionDeclarations: [createMemoFunction, readMemoFunction, updateMemoFunction, createTaskFunction, updateTaskFunction, deleteTaskFunction, analyzeDataRoomFileFunction, updateDealMemoryFunction, generateImageFunction, updateDealFunction] }],
          toolConfig: { includeServerSideToolInvocations: true },
          thinkingConfig: thinkingMode ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
        }
      });

      let currentStream = responseStream;
      let isDone = false;
      let fullText = '';
      let groundingUrls: string[] = [];
      let iterationCount = 0;

      while (!isDone && iterationCount < 10) {
        iterationCount++;
        let currentFunctionCalls: any[] = [];
        const currentFunctionResponses: any[] = [];
        const currentAdditionalParts: any[] = [];
        let currentModelParts: any[] = [];

        for await (const chunk of currentStream) {
          if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current);
            loadingIntervalRef.current = null;
          }

          if (chunk.candidates?.[0]?.content?.parts) {
            currentModelParts.push(...chunk.candidates[0].content.parts);
          }
          if (chunk.text) {
            fullText += chunk.text;
            setStreamingResponse(cleanText(fullText));
            setLoadingStage('Drafting response...');
          }
          if (chunk.functionCalls) {
            currentFunctionCalls.push(...chunk.functionCalls);
            for (const call of chunk.functionCalls) {
              if (call.name === 'createMemo') {
                setLoadingStage('Creating memo...');
              const args = call.args as any;
              const docRef = await addDoc(collection(db, 'memos'), {
                dealId,
                title: args.title,
                content: args.content,
                createdBy: user.uid,
                createdAt: new Date().toISOString()
              });
              currentFunctionResponses.push({
                name: call.name,
                id: call.id,
                response: { result: `Memo created successfully with ID: ${docRef.id}` }
              });
            } else if (call.name === 'readMemo') {
              setLoadingStage('Reading memo...');
              const args = call.args as any;
              try {
                const memoDoc = await getDoc(doc(db, 'memos', args.memoId));
                if (memoDoc.exists()) {
                  const memoData = memoDoc.data();
                  currentFunctionResponses.push({
                    name: call.name,
                    id: call.id,
                    response: { 
                      result: `Successfully read memo.`,
                      title: memoData.title,
                      content: memoData.content
                    }
                  });
                } else {
                  currentFunctionResponses.push({
                    name: call.name,
                    id: call.id,
                    response: { error: `Memo with ID ${args.memoId} not found.` }
                  });
                }
              } catch (err: any) {
                currentFunctionResponses.push({
                  name: call.name,
                  id: call.id,
                  response: { error: `Failed to read memo: ${err.message}` }
                });
              }
            } else if (call.name === 'updateMemo') {
              setLoadingStage('Updating memo...');
              const args = call.args as any;
              await updateDoc(doc(db, 'memos', args.memoId), {
                title: args.title,
                content: args.content,
                updatedAt: new Date().toISOString()
              });
              currentFunctionResponses.push({
                name: call.name,
                id: call.id,
                response: { result: `Memo updated successfully.` }
              });
            } else if (call.name === 'updateDeal') {
              setLoadingStage('Updating deal details...');
              const args = call.args as any;
              const updateData: any = {};
              if (args.name !== undefined) updateData.name = args.name;
              if (args.targetCompany !== undefined) updateData.targetCompany = args.targetCompany;
              if (args.ev !== undefined) updateData.ev = args.ev;
              if (args.status !== undefined) updateData.status = args.status;
              
              if (Object.keys(updateData).length > 0) {
                updateData.updatedAt = new Date().toISOString();
                await updateDoc(doc(db, 'deals', dealId), updateData);
                currentFunctionResponses.push({
                  name: call.name,
                  id: call.id,
                  response: { result: `Deal updated successfully with: ${JSON.stringify(updateData)}` }
                });
                systemMessage += `\n\n*Updated deal details: ${Object.keys(updateData).join(', ')}*`;
              } else {
                currentFunctionResponses.push({
                  name: call.name,
                  id: call.id,
                  response: { result: `No updates provided.` }
                });
              }
            } else if (call.name === 'createTask') {
              setLoadingStage('Creating task...');
              const args = call.args as any;
              const docRef = await addDoc(collection(db, 'tasks'), {
                dealId,
                title: args.title,
                description: args.description || '',
                status: 'todo',
                priority: args.priority || 'medium',
                assignedTo: args.assignedTo || '',
                createdBy: user.uid,
                createdAt: new Date().toISOString()
              });
              currentFunctionResponses.push({
                name: call.name,
                id: call.id,
                response: { result: `Task created successfully with ID: ${docRef.id}` }
              });
            } else if (call.name === 'updateTask') {
              setLoadingStage('Updating task...');
              const args = call.args as any;
              const updateData: any = { updatedAt: new Date().toISOString() };
              if (args.status) updateData.status = args.status;
              if (args.priority) updateData.priority = args.priority;
              
              await updateDoc(doc(db, 'tasks', args.taskId), updateData);
              currentFunctionResponses.push({
                name: call.name,
                id: call.id,
                response: { result: `Task updated successfully.` }
              });
            } else if (call.name === 'deleteTask') {
              setLoadingStage('Deleting task...');
              const args = call.args as any;
              await deleteDoc(doc(db, 'tasks', args.taskId));
              currentFunctionResponses.push({
                name: call.name,
                id: call.id,
                response: { result: `Task deleted successfully.` }
              });
            } else if (call.name === 'generateImage') {
              setLoadingStage('Generating image...');
              const args = call.args as any;
              try {
                const currentAi = new GoogleGenAI({ apiKey: (process.env.API_KEY || process.env.GEMINI_API_KEY) as string });
                const imageResponse = await currentAi.models.generateContent({
                  model: 'gemini-3.1-flash-image-preview',
                  contents: { parts: [{ text: args.prompt }] },
                  config: {
                    imageConfig: {
                      aspectRatio: args.aspectRatio || "1:1",
                      imageSize: args.imageSize || "1K"
                    }
                  }
                });
                
                let base64Image = '';
                for (const part of imageResponse.candidates![0].content.parts) {
                  if (part.inlineData) {
                    base64Image = part.inlineData.data;
                    break;
                  }
                }
                
                if (base64Image) {
                  const imageId = crypto.randomUUID();
                  const imageRef = ref(storage, `deals/${dealId}/images/${imageId}.png`);
                  await uploadString(imageRef, base64Image, 'base64', { contentType: 'image/png' });
                  const downloadUrl = await getDownloadURL(imageRef);
                  
                  // Save image to Data Room
                  await addDoc(collection(db, 'files'), {
                    dealId,
                    name: `AI_Generated_${imageId.substring(0, 8)}.png`,
                    type: 'image/png',
                    size: Math.round((base64Image.length * 3) / 4),
                    url: downloadUrl,
                    uploadedBy: 'AI Analyst',
                    uploadedAt: new Date().toISOString()
                  });
                  
                  currentFunctionResponses.push({
                    name: call.name,
                    id: call.id,
                    response: { result: `Image generated successfully. Markdown link: ![Generated Image](${downloadUrl})` }
                  });
                } else {
                  currentFunctionResponses.push({
                    name: call.name,
                    id: call.id,
                    response: { error: `Failed to extract image from model response.` }
                  });
                }
              } catch (err: any) {
                console.error("Error generating image:", err);
                currentFunctionResponses.push({
                  name: call.name,
                  id: call.id,
                  response: { error: `Failed to generate image: ${err.message}` }
                });
              }
            } else if (call.name === 'updateDealMemory') {
              const args = call.args as any;
              await updateDoc(doc(db, 'deals', dealId), {
                aiMemory: args.memory,
                updatedAt: new Date().toISOString()
              });
              currentFunctionResponses.push({
                name: call.name,
                id: call.id,
                response: { result: `Deal memory updated successfully.` }
              });
            } else if (call.name === 'analyzeDataRoomFile') {
              setLoadingStage('Analyzing file...');
              const args = call.args as any;
              const file = files.find(f => f.id === args.fileId);
              if (file) {
                try {
                  const storageRef = ref(storage, `deals/${dealId}/${file.name}`);
                  let blob: Blob;
                  try {
                    // First try fetching directly from the download URL (often bypasses some SDK limits)
                    const response = await fetch(file.url);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    blob = await response.blob();
                  } catch (fetchErr) {
                    console.warn("Fetch failed, falling back to local proxy", fetchErr);
                    try {
                      const proxyUrl = `/api/proxy?url=${encodeURIComponent(file.url)}`;
                      const proxyResponse = await fetch(proxyUrl);
                      if (!proxyResponse.ok) throw new Error(`Proxy HTTP error! status: ${proxyResponse.status}`);
                      blob = await proxyResponse.blob();
                    } catch (proxyErr) {
                      console.warn("Local proxy fetch failed, falling back to getBytes", proxyErr);
                      // Fallback to getBytes with a 50MB limit
                      const arrayBuffer = await getBytes(storageRef, 50 * 1024 * 1024);
                      blob = new Blob([arrayBuffer], { type: file.type });
                    }
                  }
                  
                  const reader = new FileReader();
                  const base64data = await new Promise<string>((resolve) => {
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => resolve(reader.result as string);
                  });
                  const base64String = base64data.split(',')[1];
                  
                  currentFunctionResponses.push({
                    name: call.name,
                    id: call.id,
                    response: { result: `File content successfully retrieved and provided in the context.` }
                  });
                  
                  currentAdditionalParts.push({ text: `Content of file ${file.name}:` });
                  currentAdditionalParts.push({ inlineData: { mimeType: file.type, data: base64String } });
                } catch (err: any) {
                  console.error("Error fetching file:", err);
                  let errorMessage = `Failed to fetch file: ${err.message}`;
                  if (err.code === 'storage/unauthorized') {
                    errorMessage = `Permission denied. Please update your Firebase Storage rules in the Firebase Console to allow authenticated users to read and write.`;
                  } else if (err.code === 'storage/retry-limit-exceeded' || err.message.includes('Failed to fetch')) {
                    errorMessage = `Connection timeout or CORS error. This usually happens if the file is too large, or if your Firebase Storage bucket doesn't have CORS configured for downloads. To fix CORS, you need to run 'gsutil cors set cors.json gs://${storage.app.options.storageBucket}' with a valid cors.json file.`;
                  } else if (file.url.startsWith('simulated-url')) {
                    errorMessage = `This file was uploaded without actual storage (metadata only). Please delete it and re-upload after fixing your Firebase Storage rules.`;
                  }
                  currentFunctionResponses.push({
                    name: call.name,
                    id: call.id,
                    response: { error: errorMessage }
                  });
                }
              } else {
                currentFunctionResponses.push({
                  name: call.name,
                  id: call.id,
                  response: { error: `File with ID ${args.fileId} not found.` }
                });
              }
            }
          }
        }
        const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          groundingUrls.push(...chunks.map((c: any) => c.web?.uri).filter(Boolean));
        }
      }

      if (currentFunctionCalls.length > 0) {
        // Add the model's response with the function call to history
        historyContents.push({
          role: 'model',
          parts: currentModelParts
        });
        
        // Add the function responses to history
        historyContents.push({
          role: 'user',
          parts: [
            ...currentFunctionResponses.map(fr => ({
              functionResponse: {
                name: fr.name,
                id: fr.id,
                response: fr.response
              }
            })),
            ...currentAdditionalParts
          ]
        });

        // Call the model again to get the final text response or more function calls
        currentStream = await ai.models.generateContentStream({
          model: modelName,
          contents: historyContents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.4,
            maxOutputTokens: 65536,
            tools: [{ googleSearch: {} }, { functionDeclarations: [createMemoFunction, readMemoFunction, updateMemoFunction, createTaskFunction, updateTaskFunction, deleteTaskFunction, analyzeDataRoomFileFunction, updateDealMemoryFunction, generateImageFunction] }],
            toolConfig: { includeServerSideToolInvocations: true },
            thinkingConfig: thinkingMode ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
          }
        });
      } else {
        isDone = true;
      }
    }

      const responseText = cleanText(fullText) || 'No response generated.';

      // Save AI response
      const aiMessage: any = {
        dealId,
        role: 'model',
        content: responseText,
        createdAt: new Date().toISOString()
      };
      
      if (groundingUrls.length > 0) {
        aiMessage.groundingUrls = groundingUrls;
      }
      
      await addDoc(collection(db, 'messages'), aiMessage);

    } catch (error: any) {
      console.error("Error sending message:", error);
      await addDoc(collection(db, 'messages'), {
        dealId,
        role: 'system',
        content: `Error: ${error.message}`,
        createdAt: new Date().toISOString()
      });
    } finally {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
      setIsTyping(false);
      setStreamingResponse('');
      setLoadingStage('Thinking...');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F4F0]">
      <div className="flex items-center justify-between p-4 border-b-2 border-black bg-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#CC0000]" />
          <h2 className="font-bold uppercase tracking-wider text-black">Ask AI</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThinkingMode(!thinkingMode)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
              thinkingMode 
                ? 'bg-[#CC0000] text-white border-black' 
                : 'bg-white text-black border-black'
            }`}
            title="Deep Thinking Mode"
          >
            <Sparkles className="w-3 h-3" />
            {thinkingMode ? 'Deep' : 'Fast'}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:bg-gray-200 transition-colors border-2 border-transparent hover:border-black"
            title="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-black">
            <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <BrainCircuit className="w-8 h-8 text-[#CC0000]" />
            </div>
            <div>
              <p className="font-bold text-lg uppercase tracking-wider">I'm your AI Analyst for this deal.</p>
              <p className="text-sm font-medium text-gray-600">I can analyze the data room, answer questions, and draft diligence memos.</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setInput("Summarize the files in the data room.")} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Summarize Files</Button>
              <Button variant="outline" size="sm" onClick={() => setInput("Generate a Tech DD Memo outline.")} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Draft Memo</Button>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                msg.role === 'user' ? 'bg-white text-black' : msg.role === 'system' ? 'bg-red-100 text-[#CC0000]' : 'bg-[#CC0000] text-white'
              }`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : msg.role === 'system' ? '!' : <BrainCircuit className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-white text-black' 
                  : msg.role === 'system'
                    ? 'bg-red-50 text-[#CC0000]'
                    : 'bg-white text-black'
              }`}>
                <div className="prose prose-sm md:prose-base max-w-none font-medium leading-relaxed text-black prose-p:text-black prose-headings:text-black prose-strong:text-black prose-a:text-[#CC0000] prose-a:break-all prose-li:text-black break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
                {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                  <div className="mt-4 pt-3 border-t-2 border-black">
                    <p className="text-xs font-bold uppercase tracking-wider text-black mb-2">Sources:</p>
                    <ul className="text-xs space-y-1">
                      {msg.groundingUrls.map((url: string, i: number) => (
                        <li key={i}><a href={url} target="_blank" rel="noreferrer" className="text-[#CC0000] hover:underline truncate block max-w-full font-bold">{url}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-gray-500 text-right' : 'text-gray-500'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#CC0000] flex items-center justify-center text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 md:p-4 flex flex-col gap-2 max-w-[85%] md:max-w-[80%] overflow-hidden">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#CC0000]" />
                <span className="text-sm font-bold uppercase tracking-wider text-black">
                  {loadingStage}
                </span>
              </div>
              {streamingResponse && (
                <div className="prose prose-sm md:prose-base max-w-none font-medium leading-relaxed text-black prose-p:text-black prose-headings:text-black prose-strong:text-black prose-a:text-[#CC0000] prose-a:break-all prose-li:text-black mt-2 pt-2 border-t-2 border-black/10 break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingResponse}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

        <div className="p-3 md:p-4 border-t-2 border-black bg-white pb-6 md:pb-4">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((att, i) => (
                <div key={i} className="flex items-center gap-2 bg-white text-black px-3 py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
                  {att.mimeType.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  <span className="truncate max-w-[150px]">{att.name}</span>
                  <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-black hover:text-[#CC0000]">
                    <XCircle className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/*,audio/*,video/*,application/pdf,.doc,.docx,.txt,.csv,.xlsx"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              className="flex-shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              disabled={isTyping}
            />
            <Button type="submit" disabled={(!input.trim() && attachments.length === 0) || isTyping} size="icon" className="bg-[#CC0000] text-white flex-shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3" /> {files.length} files in context
            </p>
          </div>
        </div>
    </div>
  );
}
