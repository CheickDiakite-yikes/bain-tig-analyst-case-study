import { useState, useEffect, useRef} from'react';
import { useParams, Link} from'react-router-dom';
import { doc, onSnapshot, collection, query, orderBy, addDoc, updateDoc, deleteDoc, where} from'firebase/firestore';
import { db} from'../firebase';
import { User} from'firebase/auth';
import { ArrowLeft, FileText, MessageSquare, FileUp, Download, Sparkles, BrainCircuit, CheckSquare, Edit, X, Trash2, MoreVertical} from'lucide-react';
import { Button} from'../components/ui/Button';
import { Input} from'../components/ui/Input';
import Chat from'../components/Chat';
import FileUpload from'../components/FileUpload';
import TaskBoard from'../components/TaskBoard';
import TaskModal from'../components/TaskModal';
import { ImageViewerModal} from'../components/ui/ImageViewerModal';
import ReactMarkdown from'react-markdown';
import remarkGfm from'remark-gfm';
import html2pdf from 'html2pdf.js';

const stripMarkdown = (text: string) => {
 if (!text) return'';
 return text
 .replace(/[#*`_~>]/g,'')
 .replace(/\[([^\]]+)\]\([^)]+\)/g,'$1')
 .replace(/\n+/g,'')
 .trim();
};

export default function DealRoom({ user}: { user: User}) {
 const { dealId} = useParams<{ dealId: string}>();
 const [deal, setDeal] = useState<any>(null);
 const [activeTab, setActiveTab] = useState<'memos' |'files' |'tasks'>('memos');
 const [isChatOpen, setIsChatOpen] = useState(true);
 const [files, setFiles] = useState<any[]>([]);
 const [memos, setMemos] = useState<any[]>([]);
 const [tasks, setTasks] = useState<any[]>([]);
 const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);
 const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
 const [isEditDealModalOpen, setIsEditDealModalOpen] = useState(false);
 const [initialChatInput, setInitialChatInput] = useState<string>('');
 const [memoToDelete, setMemoToDelete] = useState<any>(null);
 const [openMemoMenuId, setOpenMemoMenuId] = useState<string | null>(null);

 useEffect(() => {
 if (!dealId) return;
 
 const tenantId = user.email?.split('@')[1] || 'unknown';

 const unsubDeal = onSnapshot(doc(db,'deals', dealId), (doc) => {
 if (doc.exists()) {
 setDeal({ id: doc.id, ...doc.data()} as any);
}
});

 const qFiles = query(collection(db,'files'), orderBy('uploadedAt','desc'));
 const unsubFiles = onSnapshot(qFiles, (snapshot) => {
 const allFiles = snapshot.docs.map(d => ({ id: d.id, ...d.data()} as any)).filter(f => f.dealId === dealId);
 const filteredFiles = allFiles.filter(f => !f.tenantId || f.tenantId === tenantId);
 setFiles(filteredFiles);
 filteredFiles.forEach(async (f) => {
   if (!f.tenantId) {
     try { await updateDoc(doc(db, 'files', f.id), { tenantId }); } catch(e) {}
   }
 });
});

 const qMemos = query(collection(db,'memos'), orderBy('createdAt','desc'));
 const unsubMemos = onSnapshot(qMemos, (snapshot) => {
 const allMemos = snapshot.docs.map(d => ({ id: d.id, ...d.data()} as any)).filter(m => m.dealId === dealId);
 const filteredMemos = allMemos.filter(m => !m.tenantId || m.tenantId === tenantId);
 setMemos(filteredMemos);
 filteredMemos.forEach(async (m) => {
   if (!m.tenantId) {
     try { await updateDoc(doc(db, 'memos', m.id), { tenantId }); } catch(e) {}
   }
 });
});

 const qTasks = query(collection(db,'tasks'), orderBy('createdAt','desc'));
 const unsubTasks = onSnapshot(qTasks, (snapshot) => {
 const allTasks = snapshot.docs.map(d => ({ id: d.id, ...d.data()} as any)).filter(t => t.dealId === dealId);
 const filteredTasks = allTasks.filter(t => !t.tenantId || t.tenantId === tenantId);
 setTasks(filteredTasks);
 filteredTasks.forEach(async (t) => {
   if (!t.tenantId) {
     try { await updateDoc(doc(db, 'tasks', t.id), { tenantId }); } catch(e) {}
   }
 });
});

 return () => {
 unsubDeal();
 unsubFiles();
 unsubMemos();
 unsubTasks();
};
}, [dealId, user.email, user.uid]);

 if (!deal) return <div className="animate-pulse text-muted-foreground">Loading deal room...</div>;

 return (
 <div className="absolute inset-0 flex overflow-hidden bg-[#F4F4F0]">
 {/* Main Content Area */}
 <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-8 bg-[#F4F4F0]">
 <div className="flex flex-col gap-4 md:gap-6 border-b-2 border-black mb-4 md:mb-6">
 <div className="flex items-start justify-between gap-4">
 <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
 <Link to="/dashboard" className="p-2 hover:bg-white border-2 border-transparent hover:border-black transition-all shrink-0 -ml-2 md:ml-0 mt-0.5 md:mt-0">
 <ArrowLeft className="w-5 h-5 text-black" />
 </Link>
 <div className="min-w-0 flex-1 pt-1">
 <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black uppercase break-words leading-tight mb-1">{deal.name}</h1>
 <div className="text-xs md:text-sm text-gray-600 font-bold uppercase tracking-wider flex flex-wrap gap-x-2 gap-y-1">
 <span>Target: {deal.targetCompany}</span>
 <span className="hidden md:inline">•</span>
 <span>EV: ${deal.ev}M</span>
 <span className="hidden md:inline">•</span>
 <span>Status: {deal.status.toUpperCase()}</span>
 </div>
 </div>
 </div>
 
 <div className="flex items-center gap-2 mt-1">
 <Button 
 onClick={() => setIsEditDealModalOpen(true)}
 variant="outline"
 className="gap-2 border-2 border-black text-black hover:bg-gray-100  shrink-0"
>
 <Edit className="w-4 h-4" /> <span className="hidden md:inline">Edit Deal</span>
 </Button>
 {!isChatOpen && (
 <Button 
 onClick={() => setIsChatOpen(true)}
 variant="outline"
 className="gap-2 border-2 border-black text-black hover:bg-gray-100  shrink-0"
>
 <MessageSquare className="w-4 h-4" /> <span className="hidden md:inline">Ask AI</span>
 </Button>
 )}
 </div>
 </div>

 <div className="flex items-center gap-4 md:gap-8 px-2 -mb-[2px] overflow-x-auto no-scrollbar">
 <button
 onClick={() => setActiveTab('memos')}
 className={`flex items-center gap-2 pb-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-4 whitespace-nowrap ${
 activeTab ==='memos' ?'border-[#CC0000] text-black' :'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
}`}
>
 <FileText className="w-4 h-4" /> Memos
 </button>
 <button
 onClick={() => setActiveTab('files')}
 className={`flex items-center gap-2 pb-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-4 whitespace-nowrap ${
 activeTab ==='files' ?'border-[#CC0000] text-black' :'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
}`}
>
 <FileUp className="w-4 h-4" /> Data Room ({files.length})
 </button>
 <button
 onClick={() => setActiveTab('tasks')}
 className={`flex items-center gap-2 pb-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-4 whitespace-nowrap ${
 activeTab ==='tasks' ?'border-[#CC0000] text-black' :'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
}`}
>
 <CheckSquare className="w-4 h-4" /> Tasks ({tasks.length})
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-hidden bg-white border-2 border-black">
 {activeTab ==='files' && <FileUpload dealId={dealId!} user={user} files={files} />}
 {activeTab ==='tasks' && (
 <div className="p-4 md:p-6 h-full overflow-auto">
 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 border-b-2 border-black pb-4 gap-4">
 <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-black">Due Diligence Tasks</h2>
 <div className="flex flex-wrap gap-2">
 <Button onClick={() => setIsTaskModalOpen(true)} variant="outline" size="sm" className="border-2 border-black flex-1 md:flex-none">
 <CheckSquare className="w-4 h-4 mr-2" /> New Task
 </Button>
 <Button onClick={() => {
 setInitialChatInput("Please create a new due diligence task based on our recent findings.");
 setIsChatOpen(true);
}} variant="outline" size="sm" className="border-2 border-black flex-1 md:flex-none">
 <Sparkles className="w-4 h-4 mr-2" /> Ask AI to Create Task
 </Button>
 </div>
 </div>
 {tasks.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-black bg-white p-4">
 <CheckSquare className="w-12 h-12 text-gray-400 mb-4" />
 <h3 className="text-lg font-bold uppercase tracking-wider text-black mb-2">No tasks found</h3>
 <p className="text-gray-600 font-medium max-w-md text-sm mb-4">
 Create tasks to track due diligence progress. You can ask the AI to generate tasks based on the data room files.
 </p>
 </div>
 ) : (
 <TaskBoard 
 tasks={tasks} 
 dealId={dealId!} 
 onAskAI={(task) => {
 setInitialChatInput(`Please complete this task:\n\n**Task:** ${task.title}\n**Description:** ${task.description ||'No description provided.'}\n\nOnce you have finished the work, please use the updateTask tool to mark task ID \`${task.id}\` as'done'.`);
 setIsChatOpen(true);
}}
 />
 )}
 </div>
 )}
 {activeTab ==='memos' && (
 <div className="p-4 md:p-6 h-full overflow-hidden flex flex-col">
 {selectedMemoId ? (
 <MemoEditor memo={memos.find(m => m.id === selectedMemoId)} onClose={() => setSelectedMemoId(null)} onDelete={(memo) => setMemoToDelete(memo)} />
 ) : (
 <>
 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 border-b-2 border-black pb-4 flex-shrink-0 gap-4">
 <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-black">Memos</h2>
 <Button onClick={() => {
 setInitialChatInput("Please generate a new memo for this deal.");
 setIsChatOpen(true);
}} variant="outline" size="sm" className="border-2 border-black w-full md:w-auto">
 <BrainCircuit className="w-4 h-4 mr-2" /> Generate New Memo
 </Button>
 </div>
 <div className="flex-1 overflow-auto">
 {memos.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-black bg-white p-4">
 <FileText className="w-12 h-12 text-gray-400 mb-4" />
 <h3 className="text-lg font-bold uppercase tracking-wider text-black mb-2">No memo found</h3>
 <p className="text-gray-600 font-medium max-w-md text-sm mb-4">
 Create a memo to send around to the team. You can either create a memo from scratch using the AI, or leverage a template to generate your first draft.
 </p>
 <Button onClick={() => {
 setInitialChatInput("Please draft a new memo for this deal based on the files in the data room.");
 setIsChatOpen(true);
}} className="bg-[#CC0000] text-white gap-2 border-2 border-black  w-full md:w-auto">
 <Sparkles className="w-4 h-4 mr-2" /> Ask AI to Draft Memo
 </Button>
 </div>
 ) : (
 <div className="grid gap-4 pb-4">
 {memos.map(memo => (
 <div key={memo.id} onClick={() => setSelectedMemoId(memo.id)} className="cursor-pointer p-4 border-2 border-black bg-white hover:bg-gray-50 transition-all">
 <div className="flex items-center justify-between mb-2">
 <h3 className="font-bold text-base md:text-lg text-black uppercase tracking-wider line-clamp-2 md:line-clamp-1">{memo.title}</h3>
 <div className="relative shrink-0 ml-2">
 <Button 
 variant="ghost" 
 size="sm" 
 onClick={(e) => { 
 e.stopPropagation(); 
 setOpenMemoMenuId(openMemoMenuId === memo.id ? null : memo.id); 
}} 
 className="border-2 border-transparent hover:border-black p-1 h-auto"
>
 <MoreVertical className="w-5 h-5" />
 </Button>
 {openMemoMenuId === memo.id && (
 <>
 <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMemoMenuId(null);}} />
 <div className="absolute right-0 top-full mt-1 w-36 bg-white border-2 border-black z-50 flex flex-col">
 <button 
 onClick={(e) => { e.stopPropagation(); setOpenMemoMenuId(null); /* download logic */}} 
 className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 text-left border-b-2 border-black text-black"
>
 <Download className="w-4 h-4" /> Download
 </button>
 <button 
 onClick={(e) => { e.stopPropagation(); setOpenMemoMenuId(null); setMemoToDelete(memo);}} 
 className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-50 text-[#CC0000] text-left"
>
 <Trash2 className="w-4 h-4" /> Delete
 </button>
 </div>
 </>
 )}
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600 font-medium line-clamp-3 leading-relaxed">{stripMarkdown(memo.content)}</p>
 <p className="text-[10px] md:text-xs text-black font-bold uppercase tracking-wider mt-4">Generated on {new Date(memo.createdAt).toLocaleDateString()}</p>
 </div>
 ))}
 </div>
 )}
 </div>
 </>
 )}
 </div>
 )}
 </div>
 </div>

 {/* Right Sidebar Chat Panel */}
 {isChatOpen && (
 <div className="absolute inset-0 z-20 md:relative md:inset-auto w-full md:w-[400px] border-l-2 border-black bg-white flex-shrink-0 animate-in slide-in-from-right-8 duration-300">
 <Chat 
 deal={deal} 
 dealId={dealId!} 
 user={user} 
 files={files} 
 memos={memos} 
 tasks={tasks} 
 onClose={() => setIsChatOpen(false)} 
 initialInput={initialChatInput}
 />
 </div>
 )}

 {/* Modals */}
 {isTaskModalOpen && (
 <TaskModal dealId={dealId!} user={user} onClose={() => setIsTaskModalOpen(false)} />
 )}
 {isEditDealModalOpen && (
 <EditDealModal deal={deal} dealId={dealId!} onClose={() => setIsEditDealModalOpen(false)} />
 )}
 {memoToDelete && (
 <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
 <div className="bg-white border-4 border-black p-6 max-w-md w-full">
 <h3 className="text-xl font-bold uppercase tracking-wider text-black mb-4">Delete Memo</h3>
 <p className="mb-6 font-medium text-gray-700">
 Are you sure you want to delete <span className="font-bold">{memoToDelete.title}</span>? This action cannot be undone.
 </p>
 <div className="flex justify-end gap-4">
 <Button variant="outline" onClick={() => setMemoToDelete(null)} className="border-2 border-black">
 Cancel
 </Button>
 <Button onClick={async () => {
 try {
 await deleteDoc(doc(db,'memos', memoToDelete.id));
 setMemoToDelete(null);
 if (selectedMemoId === memoToDelete.id) {
 setSelectedMemoId(null);
}
} catch (error) {
 console.error("Error deleting memo:", error);
 alert("Failed to delete memo.");
}
}} className="bg-[#CC0000] hover:bg-red-700 text-white border-2 border-black">
 Delete
 </Button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}

function EditDealModal({ deal, dealId, onClose}: { deal: any, dealId: string, onClose: () => void}) {
 const [name, setName] = useState(deal.name);
 const [targetCompany, setTargetCompany] = useState(deal.targetCompany);
 const [ev, setEv] = useState(deal.ev?.toString() ||'');
 const [status, setStatus] = useState(deal.status);
 const [isSaving, setIsSaving] = useState(false);

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSaving(true);
 try {
 await updateDoc(doc(db,'deals', dealId), {
 name,
 targetCompany,
 ev: ev ? parseFloat(ev) : 0,
 status,
 updatedAt: new Date().toISOString()
});
 onClose();
} catch (error) {
 console.error("Error updating deal:", error);
 alert("Failed to update deal.");
} finally {
 setIsSaving(false);
}
};

 return (
 <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
 <div className="bg-white border-4 border-black p-6 max-w-md w-full">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-bold uppercase tracking-wider text-black">Edit Deal Room</h2>
 <Button variant="ghost" size="icon" onClick={onClose} className="border-2 border-transparent hover:border-black">
 <X className="w-5 h-5" />
 </Button>
 </div>
 
 <form onSubmit={handleSave} className="space-y-4">
 <div className="space-y-2">
 <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Name</label>
 <Input 
 value={name} 
 onChange={e => setName(e.target.value)} 
 placeholder="e.g. Project Apollo" 
 required
 className="border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-[#CC0000]"
 />
 </div>
 
 <div className="space-y-2">
 <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Target Company</label>
 <Input 
 value={targetCompany} 
 onChange={e => setTargetCompany(e.target.value)} 
 placeholder="e.g. Acme Corp" 
 required
 className="border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-[#CC0000]"
 />
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Enterprise Value ($M)</label>
 <Input 
 type="number"
 value={ev} 
 onChange={e => setEv(e.target.value)} 
 placeholder="e.g. 500" 
 className="border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-[#CC0000]"
 />
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Status</label>
 <select 
 value={status} 
 onChange={e => setStatus(e.target.value)}
 className="w-full border-2 border-black rounded-none p-2 focus-visible:ring-0 focus-visible:border-[#CC0000] bg-white font-medium"
>
 <option value="sourcing">Sourcing</option>
 <option value="diligence">Diligence</option>
 <option value="closed">Closed</option>
 <option value="passed">Passed</option>
 </select>
 </div>

 <div className="pt-4 flex justify-end gap-4">
 <Button type="button" variant="outline" onClick={onClose} className="border-2 border-black">
 Cancel
 </Button>
 <Button type="submit" disabled={isSaving} className="bg-[#CC0000] hover:bg-red-700 text-white border-2 border-black">
 {isSaving ?'Saving...' :'Save Changes'}
 </Button>
 </div>
 </form>
 </div>
 </div>
 );
}

function MemoEditor({ memo, onClose, onDelete}: { memo: any, onClose: () => void, onDelete: (memo: any) => void}) {
 const [title, setTitle] = useState(memo?.title ||'');
 const [content, setContent] = useState(memo?.content ||'');
 const [isSaving, setIsSaving] = useState(false);
 const [viewMode, setViewMode] = useState<'edit' |'preview'>('preview');
 const [viewingImage, setViewingImage] = useState<string | null>(null);
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
 setIsMenuOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 useEffect(() => {
 if (memo) {
 setTitle(memo.title);
 setContent(memo.content);
}
}, [memo]);

 if (!memo) return null;

 const handleSave = async () => {
 setIsSaving(true);
 try {
 await updateDoc(doc(db,'memos', memo.id), {
 title,
 content,
 updatedAt: new Date().toISOString()
});
} catch (e) {
 console.error(e);
}
 setIsSaving(false);
};

 const exportPdf = () => {
 const element = document.getElementById('memo-export-content');
 if (!element) return;
 
 const opt = {
 margin: 15,
 filename: `${title || 'memo'}.pdf`,
 image: { type: 'jpeg' as const, quality: 0.98 },
 html2canvas: { 
 scale: 2, 
 useCORS: true,
 onclone: (doc: Document) => {
 const styles = doc.querySelectorAll('style, link[rel="stylesheet"]');
 styles.forEach(s => s.remove());
 
 const style = doc.createElement('style');
 style.innerHTML = `
 body { font-family: sans-serif; color: #000; background: #fff; }
 h1, h2, h3, h4 { color: #000; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
 h1 { font-size: 24px; }
 h2 { font-size: 20px; }
 h3 { font-size: 18px; }
 p { margin-bottom: 1em; line-height: 1.5; }
 img { max-width: 100%; height: auto; }
 table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
 th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
 th { background-color: #f3f4f6; }
 code { background-color: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
 pre { background-color: #f3f4f6; padding: 1em; border-radius: 4px; overflow-x: auto; }
 pre code { background-color: transparent; padding: 0; }
 blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 1em; color: #4b5563; }
 ul, ol { margin-bottom: 1em; padding-left: 2em; }
 li { margin-bottom: 0.25em; }
 `;
 doc.head.appendChild(style);
 }
 },
 jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
 };
 
 html2pdf().set(opt).from(element).save();
 setIsMenuOpen(false);
 };

 const exportWord = () => {
 const element = document.getElementById('memo-export-content');
 if (!element) return;
 
 const html = `
 <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
 <head>
 <meta charset='utf-8'>
 <title>${title || 'Memo'}</title>
 <style>
 body { font-family: Arial, sans-serif; color: #000000; }
 h1 { font-size: 24pt; font-weight: bold; margin-bottom: 12pt; }
 h2 { font-size: 18pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt; }
 h3 { font-size: 14pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; }
 p { font-size: 11pt; line-height: 1.5; margin-bottom: 10pt; }
 table { border-collapse: collapse; width: 100%; margin-bottom: 10pt; }
 th, td { border: 1pt solid #cccccc; padding: 6pt; text-align: left; }
 th { background-color: #f2f2f2; font-weight: bold; }
 code { font-family: 'Courier New', Courier, monospace; background-color: #f4f4f4; padding: 2pt; }
 pre { background-color: #f4f4f4; padding: 10pt; }
 blockquote { border-left: 3pt solid #cccccc; padding-left: 10pt; color: #666666; margin-left: 0; }
 img { max-width: 100%; }
 </style>
 </head>
 <body>
 ${element.innerHTML}
 </body>
 </html>
 `;
 
 const blob = new Blob(['\ufeff', html], {
 type: 'application/msword'
 });
 
 const url = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `${title || 'memo'}.doc`;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 URL.revokeObjectURL(url);
 setIsMenuOpen(false);
 };

 const handleExport = (type: 'pdf' | 'word') => {
 const doExport = type === 'pdf' ? exportPdf : exportWord;
 
 if (viewMode === 'edit') {
 setViewMode('preview');
 setTimeout(() => {
 doExport();
 }, 500);
 } else {
 doExport();
 }
 };

 return (
 <div className="flex flex-col h-full overflow-hidden">
 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b-2 border-black flex-shrink-0 gap-4">
 <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
 <Button variant="ghost" size="sm" onClick={onClose} className="border-2 border-black shrink-0">
 <ArrowLeft className="w-4 h-4" />
 </Button>
 <input 
 value={title}
 onChange={e => setTitle(e.target.value)}
 className="text-base md:text-lg font-bold uppercase tracking-wider text-black bg-transparent border-none focus:outline-none focus:ring-0 w-full min-w-0 truncate"
 />
 </div>
 <div className="flex items-center gap-2 self-end md:self-auto shrink-0 relative" ref={menuRef}>
 <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="border-2 border-black">
 <MoreVertical className="w-4 h-4" />
 </Button>
 {isMenuOpen && (
 <div className="absolute top-full right-0 mt-2 w-48 bg-white border-2 border-black shadow-lg z-50 flex flex-col">
 <button 
 onClick={() => { setViewMode(v => v ==='edit' ?'preview' :'edit'); setIsMenuOpen(false); }}
 className="px-4 py-3 text-left hover:bg-gray-100 border-b-2 border-black font-bold text-sm uppercase tracking-wider flex items-center gap-2"
 >
 <Edit className="w-4 h-4" /> {viewMode ==='edit' ?'Preview' :'Edit'}
 </button>
 <button 
 onClick={() => { handleSave(); setIsMenuOpen(false); }}
 disabled={isSaving || (title === memo.title && content === memo.content)}
 className="px-4 py-3 text-left hover:bg-gray-100 border-b-2 border-black font-bold text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
 >
 <CheckSquare className="w-4 h-4" /> {isSaving ?'Saving...' :'Save'}
 </button>
 <button 
 onClick={() => handleExport('pdf')}
 className="px-4 py-3 text-left hover:bg-gray-100 border-b-2 border-black font-bold text-sm uppercase tracking-wider flex items-center gap-2"
 >
 <Download className="w-4 h-4" /> Export PDF
 </button>
 <button 
 onClick={() => handleExport('word')}
 className="px-4 py-3 text-left hover:bg-gray-100 border-b-2 border-black font-bold text-sm uppercase tracking-wider flex items-center gap-2"
 >
 <FileText className="w-4 h-4" /> Export Word
 </button>
 <button 
 onClick={() => { onDelete(memo); setIsMenuOpen(false); }}
 className="px-4 py-3 text-left hover:bg-red-50 text-[#CC0000] font-bold text-sm uppercase tracking-wider flex items-center gap-2"
 >
 <Trash2 className="w-4 h-4" /> Delete
 </button>
 </div>
 )}
 </div>
 </div>
 <div className="flex-1 overflow-auto bg-white border-2 border-black p-6">
 {viewMode ==='edit' ? (
 <textarea 
 value={content}
 onChange={e => setContent(e.target.value)}
 className="w-full h-full resize-none border-none focus:outline-none font-mono text-sm"
 placeholder="Write your memo here in Markdown..."
 />
 ) : (
 <div id="memo-export-content" className="prose prose-sm max-w-none p-4">
 <h1 className="text-2xl font-bold mb-6">{title}</h1>
 <ReactMarkdown 
 remarkPlugins={[remarkGfm]}
 components={{
 img: ({node, ...props}) => (
 <img 
 {...props} 
 className="cursor-pointer hover:opacity-80 transition-opacity border-2 border-black my-4"
 onClick={() => setViewingImage(props.src || null)}
 />
 )
}}
>
 {content}
 </ReactMarkdown>
 </div>
 )}
 </div>
 <ImageViewerModal src={viewingImage} onClose={() => setViewingImage(null)} />
 </div>
 );
}
