import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FolderOpen, DollarSign, Activity, Plus, ArrowRight, X, FileText, MessageSquare } from 'lucide-react';

export default function Dashboard({ user }: { user: User }) {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDealName, setNewDealName] = useState('');
  const [newDealTarget, setNewDealTarget] = useState('');
  const [newDealEV, setNewDealEV] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'deals'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dealsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeals(dealsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealName || !newDealTarget) return;
    
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'deals'), {
        name: newDealName,
        targetCompany: newDealTarget,
        status: 'sourcing',
        ev: newDealEV ? parseFloat(newDealEV) : 0,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setNewDealName('');
      setNewDealTarget('');
      setNewDealEV('');
      setIsModalOpen(false);
      navigate(`/deals/${docRef.id}`);
    } catch (error) {
      console.error("Error creating deal:", error);
      alert("Failed to create deal. Check console.");
    } finally {
      setIsCreating(false);
    }
  };

  const activeDeals = deals.filter(d => d.status !== 'closed' && d.status !== 'passed');
  const pipelineEV = activeDeals.reduce((sum, deal) => sum + (deal.ev || 0), 0);
  const diligenceCount = deals.filter(d => d.status === 'diligence').length;

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading pipeline...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-1 uppercase">Deal Pipeline</h1>
          <p className="text-gray-500 font-bold uppercase tracking-wider">Active Mandate: Bain Capital (Private Equity)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-black uppercase tracking-wider">Active Deal Rooms</CardTitle>
            <FolderOpen className="w-4 h-4 text-[#CC0000]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-black">{activeDeals.length}</div>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1">+2 this week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-black uppercase tracking-wider">Pipeline EV (Implied)</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-black">${pipelineEV}M</div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Across {activeDeals.length} targets</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-black uppercase tracking-wider">Diligence Phase</CardTitle>
            <Activity className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-black">{diligenceCount}</div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Deep dive analysis</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-[#CC0000] border-2 border-black text-white cursor-pointer hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
          onClick={() => setIsModalOpen(true)}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Plus className="w-6 h-6 text-[#CC0000]" />
            </div>
            <h3 className="font-bold text-lg uppercase tracking-wider">NEW DEAL ROOM</h3>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-5xl space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
            <FolderOpen className="w-4 h-4" /> ACTIVE DEALS
          </h2>
        </div>
        
        {activeDeals.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-black font-bold uppercase tracking-wider">PIPELINE EMPTY</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeDeals.map(deal => (
              <div key={deal.id} className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-4">
                {/* Top Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <span className="px-3 py-1 bg-white text-black border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className={`w-2 h-2 border border-black ${deal.status === 'diligence' ? 'bg-blue-500' : 'bg-[#CC0000]'}`} />
                    Status: {deal.status}
                  </span>
                  <span className="px-3 py-1 bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Technology
                  </span>
                  <div className="flex-1" />
                  <span className="px-3 py-1 bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    EV: ${deal.ev}M
                  </span>
                  <span className="px-3 py-1 bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
                    🇺🇸 Country: US
                  </span>
                  <span className="px-3 py-1 bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Date: {new Date(deal.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-xl text-black mb-2 uppercase tracking-tight">{deal.name} - {deal.targetCompany}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 font-medium">
                    {deal.targetCompany} is a leading technology provider operating in the software and services sector. 
                    The company has demonstrated consistent growth and presents a strong M&A opportunity with an enterprise 
                    value of ${deal.ev}M. This deal room contains all relevant diligence materials, financial models, and 
                    management presentations for the evaluation process.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t-2 border-black mt-2">
                  <Link to={`/deals/${deal.id}`}>
                    <Button className="bg-[#CC0000] text-white gap-2">
                      <ArrowRight className="w-4 h-4" /> View Deal Room
                    </Button>
                  </Link>
                  <div className="flex-1" />
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" /> Investment Memo
                  </Button>
                  <Link to={`/deals/${deal.id}`}>
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="w-4 h-4" /> Ask AI Analyst
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b-4 border-black bg-[#CC0000]">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white uppercase tracking-wider">
                <Plus className="w-5 h-5 text-white" /> Create Deal Room
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-white hover:text-black hover:bg-white transition-colors p-1 border-2 border-transparent hover:border-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-white">
              <form onSubmit={handleCreateDeal} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-black">Project Name</label>
                  <Input 
                    value={newDealName} 
                    onChange={e => setNewDealName(e.target.value)} 
                    placeholder="e.g. Project Apollo" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-black">Target Company</label>
                  <Input 
                    value={newDealTarget} 
                    onChange={e => setNewDealTarget(e.target.value)} 
                    placeholder="e.g. Acme SaaS Corp" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-black">Enterprise Value ($M)</label>
                  <Input 
                    type="number"
                    value={newDealEV} 
                    onChange={e => setNewDealEV(e.target.value)} 
                    placeholder="e.g. 250" 
                  />
                </div>
                <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-black mt-6 pt-6">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Initialize Deal Room'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
