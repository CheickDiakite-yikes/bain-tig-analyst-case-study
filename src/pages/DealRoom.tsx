import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, collection, query, orderBy, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';
import { ArrowLeft, FileText, MessageSquare, FileUp, Download, Sparkles, BrainCircuit, CheckSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Chat from '../components/Chat';
import FileUpload from '../components/FileUpload';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const stripMarkdown = (text: string) => {
  if (!text) return '';
  return text
    .replace(/[#*`_~>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
};

export default function DealRoom({ user }: { user: User }) {
  const { dealId } = useParams<{ dealId: string }>();
  const [deal, setDeal] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'memos' | 'files' | 'tasks'>('memos');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const [memos, setMemos] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);

  useEffect(() => {
    if (!dealId) return;
    
    const unsubDeal = onSnapshot(doc(db, 'deals', dealId), (doc) => {
      if (doc.exists()) {
        setDeal({ id: doc.id, ...doc.data() } as any);
      }
    });

    const qFiles = query(collection(db, 'files'), orderBy('uploadedAt', 'desc'));
    const unsubFiles = onSnapshot(qFiles, (snapshot) => {
      setFiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(f => f.dealId === dealId));
    });

    const qMemos = query(collection(db, 'memos'), orderBy('createdAt', 'desc'));
    const unsubMemos = onSnapshot(qMemos, (snapshot) => {
      setMemos(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(m => m.dealId === dealId));
    });

    const qTasks = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(t => t.dealId === dealId));
    });

    return () => {
      unsubDeal();
      unsubFiles();
      unsubMemos();
      unsubTasks();
    };
  }, [dealId]);

  if (!deal) return <div className="animate-pulse text-muted-foreground">Loading deal room...</div>;

  return (
    <div className="flex h-screen overflow-hidden -m-8">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-8 bg-[#F4F4F0]">
        <div className="flex flex-col gap-6 border-b-2 border-black mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 hover:bg-white border-2 border-transparent hover:border-black transition-all">
                <ArrowLeft className="w-5 h-5 text-black" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-black uppercase">{deal.name}</h1>
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wider">Target: {deal.targetCompany} • EV: ${deal.ev}M • Status: {deal.status.toUpperCase()}</p>
              </div>
            </div>
            
            {!isChatOpen && (
              <Button 
                onClick={() => setIsChatOpen(true)}
                variant="outline"
                className="gap-2 border-2 border-black text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <MessageSquare className="w-4 h-4" /> Ask AI
              </Button>
            )}
          </div>

          <div className="flex items-center gap-8 px-2 -mb-[2px]">
            <button
              onClick={() => setActiveTab('memos')}
              className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'memos' ? 'border-[#CC0000] text-black' : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4" /> Investment Memo
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'files' ? 'border-[#CC0000] text-black' : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <FileUp className="w-4 h-4" /> Data Room ({files.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'tasks' ? 'border-[#CC0000] text-black' : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <CheckSquare className="w-4 h-4" /> Tasks ({tasks.length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {activeTab === 'files' && <FileUpload dealId={dealId!} user={user} files={files} />}
          {activeTab === 'tasks' && (
            <div className="p-6 h-full overflow-auto">
              <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider text-black">Due Diligence Tasks</h2>
                <Button onClick={() => setIsChatOpen(true)} variant="outline" size="sm" className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles className="w-4 h-4 mr-2" /> Ask AI to Create Task
                </Button>
              </div>
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CheckSquare className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold uppercase tracking-wider text-black mb-2">No tasks found</h3>
                  <p className="text-gray-600 font-medium max-w-md text-sm mb-4">
                    Create tasks to track due diligence progress. You can ask the AI to generate tasks based on the data room files.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tasks.map(task => (
                    <div key={task.id} className="p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-black uppercase tracking-wider">{task.title}</h3>
                        <div className="flex gap-2">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 border-2 border-black ${task.priority === 'high' ? 'bg-red-200 text-red-900' : task.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'}`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 border-2 border-black ${task.status === 'done' ? 'bg-gray-200 text-gray-900' : task.status === 'in-progress' ? 'bg-blue-200 text-blue-900' : 'bg-white text-black'}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      {task.description && <p className="text-sm text-gray-600 font-medium mb-4">{task.description}</p>}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200">
                        <p className="text-xs text-black font-bold uppercase tracking-wider">Assigned to: {task.assignedTo || 'Unassigned'}</p>
                        <p className="text-xs text-black font-bold uppercase tracking-wider">Created on {new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'memos' && (
            <div className="p-6 h-full overflow-hidden flex flex-col">
              {selectedMemoId ? (
                <MemoEditor memo={memos.find(m => m.id === selectedMemoId)} onClose={() => setSelectedMemoId(null)} />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4 flex-shrink-0">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-black">Investment Memos</h2>
                    <Button onClick={() => setIsChatOpen(true)} variant="outline" size="sm" className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <BrainCircuit className="w-4 h-4 mr-2" /> Generate New Memo
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {memos.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-bold uppercase tracking-wider text-black mb-2">No memo found</h3>
                        <p className="text-gray-600 font-medium max-w-md text-sm mb-4">
                          Create a memo to send around to the team. You can either create a memo from scratch using the AI, or leverage a template to generate your first draft.
                        </p>
                        <Button onClick={() => setIsChatOpen(true)} className="bg-[#CC0000] text-white gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Sparkles className="w-4 h-4 mr-2" /> Ask AI to Draft Memo
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4 pb-4">
                        {memos.map(memo => (
                          <div key={memo.id} onClick={() => setSelectedMemoId(memo.id)} className="cursor-pointer p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-black uppercase tracking-wider">{memo.title}</h3>
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); /* download logic */ }} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Download className="w-4 h-4" /></Button>
                            </div>
                            <p className="text-sm text-gray-600 font-medium line-clamp-3 leading-relaxed">{stripMarkdown(memo.content)}</p>
                            <p className="text-xs text-black font-bold uppercase tracking-wider mt-4">Generated on {new Date(memo.createdAt).toLocaleDateString()}</p>
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
        <div className="w-[400px] border-l-2 border-black bg-white flex-shrink-0 animate-in slide-in-from-right-8 duration-300 shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] z-10">
          <Chat deal={deal} dealId={dealId!} user={user} files={files} memos={memos} tasks={tasks} onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
}

function MemoEditor({ memo, onClose }: { memo: any, onClose: () => void }) {
  const [title, setTitle] = useState(memo?.title || '');
  const [content, setContent] = useState(memo?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');

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
      await updateDoc(doc(db, 'memos', memo.id), {
        title,
        content,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-black flex-shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="sm" onClick={onClose} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-lg font-bold uppercase tracking-wider text-black bg-transparent border-none focus:outline-none focus:ring-0 w-full"
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm" onClick={() => setViewMode(v => v === 'edit' ? 'preview' : 'edit')} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {viewMode === 'edit' ? 'Preview' : 'Edit'}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving || (title === memo.title && content === memo.content)} className="bg-[#CC0000] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {viewMode === 'edit' ? (
          <textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full h-full resize-none border-none focus:outline-none font-mono text-sm"
            placeholder="Write your memo here in Markdown..."
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
