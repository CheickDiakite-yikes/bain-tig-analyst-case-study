import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getBytes } from 'firebase/storage';
import { db, storage } from '../firebase';
import { User } from 'firebase/auth';
import { GoogleGenAI, ThinkingLevel, FunctionDeclaration, Type } from '@google/genai';
import { Send, BrainCircuit, Loader2, FileText, Sparkles, User as UserIcon, X, MessageSquare, Paperclip, XCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Chat({ deal, dealId, user, files, memos, tasks, onClose }: { deal: any, dealId: string, user: User, files: any[], memos?: any[], tasks?: any[], onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [attachments, setAttachments] = useState<{name: string, mimeType: string, data: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const systemInstruction = `You are an expert Private Equity Tech Due Diligence AI Analyst at Bain & Company. 
Your goal is to assist the consultant with analyzing tech stacks, evaluating software architecture, identifying technical debt, and assessing the target company's engineering team.
Be professional, analytical, concise, and use Bain's consulting frameworks when applicable.
You have advanced capabilities including document summarization, data extraction from tables, and code analysis. You can perform these tasks by analyzing the files provided in the context or attachments.
If asked to generate or draft a memo, use the createMemo tool. If asked to update a memo, use the updateMemo tool.
If asked to create a task, use the createTask tool. If asked to update a task's status or priority, use the updateTask tool.
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
        description: "Create a new investment memo in the database.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the memo." },
            content: { type: Type.STRING, description: "The full markdown content of the memo." }
          },
          required: ["title", "content"]
        }
      };

      const updateMemoFunction: FunctionDeclaration = {
        name: "updateMemo",
        description: "Update an existing investment memo in the database.",
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

      let response = await ai.models.generateContent({
        model: modelName,
        contents: historyContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
          tools: thinkingMode 
            ? [{ functionDeclarations: [createMemoFunction, updateMemoFunction, createTaskFunction, updateTaskFunction, analyzeDataRoomFileFunction, updateDealMemoryFunction] }] 
            : [{ googleSearch: {} }, { functionDeclarations: [createMemoFunction, updateMemoFunction, createTaskFunction, updateTaskFunction, analyzeDataRoomFileFunction, updateDealMemoryFunction] }],
          toolConfig: { includeServerSideToolInvocations: true },
          thinkingConfig: thinkingMode ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const functionResponses: any[] = [];
        const additionalParts: any[] = [];
        for (const call of functionCalls) {
          if (call.name === 'createMemo') {
            const args = call.args as any;
            const docRef = await addDoc(collection(db, 'memos'), {
              dealId,
              title: args.title,
              content: args.content,
              createdBy: user.uid,
              createdAt: new Date().toISOString()
            });
            functionResponses.push({
              name: call.name,
              response: { result: `Memo created successfully with ID: ${docRef.id}` }
            });
          } else if (call.name === 'updateMemo') {
            const args = call.args as any;
            await updateDoc(doc(db, 'memos', args.memoId), {
              title: args.title,
              content: args.content,
              updatedAt: new Date().toISOString()
            });
            functionResponses.push({
              name: call.name,
              response: { result: `Memo updated successfully.` }
            });
          } else if (call.name === 'createTask') {
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
            functionResponses.push({
              name: call.name,
              response: { result: `Task created successfully with ID: ${docRef.id}` }
            });
          } else if (call.name === 'updateTask') {
            const args = call.args as any;
            const updateData: any = { updatedAt: new Date().toISOString() };
            if (args.status) updateData.status = args.status;
            if (args.priority) updateData.priority = args.priority;
            
            await updateDoc(doc(db, 'tasks', args.taskId), updateData);
            functionResponses.push({
              name: call.name,
              response: { result: `Task updated successfully.` }
            });
          } else if (call.name === 'updateDealMemory') {
            const args = call.args as any;
            await updateDoc(doc(db, 'deals', dealId), {
              aiMemory: args.memory,
              updatedAt: new Date().toISOString()
            });
            functionResponses.push({
              name: call.name,
              response: { result: `Deal memory updated successfully.` }
            });
          } else if (call.name === 'analyzeDataRoomFile') {
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
                  console.warn("Fetch failed, falling back to getBytes", fetchErr);
                  // Fallback to getBytes with a 50MB limit (default is 1MB which causes retry-limit-exceeded for larger files)
                  const arrayBuffer = await getBytes(storageRef, 50 * 1024 * 1024);
                  blob = new Blob([arrayBuffer], { type: file.type });
                }
                
                const reader = new FileReader();
                const base64data = await new Promise<string>((resolve) => {
                  reader.readAsDataURL(blob);
                  reader.onloadend = () => resolve(reader.result as string);
                });
                const base64String = base64data.split(',')[1];
                
                functionResponses.push({
                  name: call.name,
                  response: { result: `File content successfully retrieved and provided in the context.` }
                });
                
                additionalParts.push({ text: `Content of file ${file.name}:` });
                additionalParts.push({ inlineData: { mimeType: file.type, data: base64String } });
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
                functionResponses.push({
                  name: call.name,
                  response: { error: errorMessage }
                });
              }
            } else {
              functionResponses.push({
                name: call.name,
                response: { error: `File with ID ${args.fileId} not found.` }
              });
            }
          }
        }

        // Add the model's response with the function call to history
        historyContents.push(response.candidates![0].content);
        
        // Add the function responses to history
        historyContents.push({
          role: 'user',
          parts: [
            ...functionResponses.map(fr => ({
              functionResponse: {
                name: fr.name,
                response: fr.response
              }
            })),
            ...additionalParts
          ]
        });

        // Call the model again to get the final text response
        response = await ai.models.generateContent({
          model: modelName,
          contents: historyContents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.2,
            tools: thinkingMode 
              ? [{ functionDeclarations: [createMemoFunction, updateMemoFunction, createTaskFunction, updateTaskFunction, analyzeDataRoomFileFunction] }] 
              : [{ googleSearch: {} }, { functionDeclarations: [createMemoFunction, updateMemoFunction, createTaskFunction, updateTaskFunction, analyzeDataRoomFileFunction] }],
            toolConfig: { includeServerSideToolInvocations: true },
            thinkingConfig: thinkingMode ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
          }
        });
      }

      const responseText = response.text || 'No response generated.';

      let groundingUrls: string[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        groundingUrls = chunks
          .map((chunk: any) => chunk.web?.uri)
          .filter(Boolean);
      }

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
      setIsTyping(false);
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
              <div className={`max-w-[80%] p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                msg.role === 'user' 
                  ? 'bg-white text-black' 
                  : msg.role === 'system'
                    ? 'bg-red-50 text-[#CC0000]'
                    : 'bg-white text-black'
              }`}>
                <div className="prose prose-sm dark:prose-invert max-w-none font-medium">
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
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#CC0000]" />
              <span className="text-sm font-bold uppercase tracking-wider text-black">
                {thinkingMode ? 'Analyzing deeply...' : 'Thinking...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

        <div className="p-4 border-t-2 border-black bg-white">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((att, i) => (
                <div key={i} className="flex items-center gap-2 bg-white text-black px-3 py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
                  {att.mimeType.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  <span className="truncate max-w-[150px]">{att.name}</span>
                  <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-black hover:text-[#CC0000]">
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
              className="flex-shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              disabled={isTyping}
            />
            <Button type="submit" disabled={(!input.trim() && attachments.length === 0) || isTyping} size="icon" className="bg-[#CC0000] text-white flex-shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
