import { useState, useEffect} from'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, where, updateDoc, doc} from'firebase/firestore';
import { db} from'../firebase';
import { User} from'firebase/auth';
import { Link, useNavigate} from'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle} from'../components/ui/Card';
import { Button} from'../components/ui/Button';
import { Input} from'../components/ui/Input';
import { FolderOpen, Activity, Plus, ArrowRight, X, FileText, MessageSquare, Search, CheckCircle} from'lucide-react';

export default function Dashboard({ user}: { user: User}) {
 const [deals, setDeals] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [newDealName, setNewDealName] = useState('');
 const [newDealTarget, setNewDealTarget] = useState('');
 const [newDealEV, setNewDealEV] = useState('');
 const [isCreating, setIsCreating] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [statusFilter, setStatusFilter] = useState<string>('active');
 const navigate = useNavigate();

 useEffect(() => {
 const tenantId = user.email?.split('@')[1] || 'unknown';
 const q = query(collection(db,'deals'), orderBy('createdAt','desc'));
 const unsubscribe = onSnapshot(q, (snapshot) => {
 const dealsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
 
 // Filter in memory for multi-tenancy + legacy
 const filteredDeals = dealsData.filter((d: any) => !d.tenantId || d.tenantId === tenantId);
 setDeals(filteredDeals);
 setLoading(false);

 // Auto-migrate legacy deals
 filteredDeals.forEach(async (d: any) => {
   if (!d.tenantId) {
     try {
       await updateDoc(doc(db, 'deals', d.id), { tenantId });
     } catch (err) {
       console.error("Migration error:", err);
     }
   }
 });
});
 return () => unsubscribe();
}, [user.email, user.uid]);

 const handleCreateDeal = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!newDealName || !newDealTarget) return;
 
 setIsCreating(true);
 try {
 const tenantId = user.email?.split('@')[1] || 'unknown';
 const docRef = await addDoc(collection(db,'deals'), {
 name: newDealName,
 targetCompany: newDealTarget,
 status:'sourcing',
 ev: newDealEV ? parseFloat(newDealEV) : 0,
 tenantId: tenantId,
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

 const activeDeals = deals.filter(d => d.status !=='closed' && d.status !=='passed');
 const sourcingCount = deals.filter(d => d.status ==='sourcing').length;
 const diligenceCount = deals.filter(d => d.status ==='diligence').length;
 const closedCount = deals.filter(d => d.status ==='closed').length;

 const filteredDeals = deals.filter(d => {
 if (statusFilter ==='active') return d.status !=='closed' && d.status !=='passed';
 if (statusFilter ==='all') return true;
 return d.status === statusFilter;
});

 if (loading) return <div className="text-muted-foreground animate-pulse">Loading pipeline...</div>;

 return (
 <div className="space-y-8">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-black mb-1 uppercase">Deal Pipeline</h1>
 <p className="text-gray-500 font-bold uppercase tracking-wider">Active Mandate: Bain Capital (Private Equity)</p>
 </div>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
 <Card className="bg-white border-2 border-black rounded-none relative">
 <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
 <CardTitle className="text-xs md:text-sm font-bold text-black uppercase tracking-wider">Sourcing Phase</CardTitle>
 <Search className="w-4 h-4 text-amber-600" />
 </CardHeader>
 <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
 <div className="text-3xl md:text-4xl font-bold text-black">{sourcingCount}</div>
 <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Initial evaluation</p>
 </CardContent>
 <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-black">
 <ArrowRight className="w-6 h-6" />
 </div>
 </Card>
 
 <Card className="bg-white border-2 border-black rounded-none relative">
 <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
 <CardTitle className="text-xs md:text-sm font-bold text-black uppercase tracking-wider">Diligence Phase</CardTitle>
 <Activity className="w-4 h-4 text-blue-600" />
 </CardHeader>
 <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
 <div className="text-3xl md:text-4xl font-bold text-black">{diligenceCount}</div>
 <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Deep dive analysis</p>
 </CardContent>
 <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-black">
 <ArrowRight className="w-6 h-6" />
 </div>
 </Card>

 <Card className="bg-white border-2 border-black rounded-none">
 <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
 <CardTitle className="text-xs md:text-sm font-bold text-black uppercase tracking-wider">Closed Deals</CardTitle>
 <CheckCircle className="w-4 h-4 text-emerald-600" />
 </CardHeader>
 <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
 <div className="text-3xl md:text-4xl font-bold text-black">{closedCount}</div>
 <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Successfully executed</p>
 </CardContent>
 </Card>

 <Card 
 className="bg-[#CC0000] border-2 border-black text-white cursor-pointer hover:bg-red-700 transition-all rounded-none"
 onClick={() => setIsModalOpen(true)}
>
 <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center h-full text-center space-y-2 md:space-y-4">
 <div className="bg-white p-2 md:p-3 border-2 border-black">
 <Plus className="w-5 h-5 md:w-6 md:h-6 text-[#CC0000]" />
 </div>
 <h3 className="font-bold text-sm md:text-lg uppercase tracking-wider">NEW DEAL ROOM</h3>
 </CardContent>
 </Card>
 </div>

 <div className="w-full space-y-4">
 <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-2 gap-4">
 <h2 className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2 shrink-0">
 <FolderOpen className="w-4 h-4" /> DEALS
 </h2>
 <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => setStatusFilter('active')}
 className={`border-2 border-black shrink-0 ${statusFilter ==='active' ?'bg-black text-white' :'bg-white text-black'}`}
>
 Active
 </Button>
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => setStatusFilter('sourcing')}
 className={`border-2 border-black shrink-0 ${statusFilter ==='sourcing' ?'bg-black text-white' :'bg-white text-black'}`}
>
 Sourcing
 </Button>
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => setStatusFilter('diligence')}
 className={`border-2 border-black shrink-0 ${statusFilter ==='diligence' ?'bg-black text-white' :'bg-white text-black'}`}
>
 Diligence
 </Button>
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => setStatusFilter('closed')}
 className={`border-2 border-black shrink-0 ${statusFilter ==='closed' ?'bg-black text-white' :'bg-white text-black'}`}
>
 Closed
 </Button>
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => setStatusFilter('passed')}
 className={`border-2 border-black shrink-0 ${statusFilter ==='passed' ?'bg-black text-white' :'bg-white text-black'}`}
>
 Passed
 </Button>
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => setStatusFilter('all')}
 className={`border-2 border-black shrink-0 ${statusFilter ==='all' ?'bg-black text-white' :'bg-white text-black'}`}
>
 All
 </Button>
 </div>
 </div>
 
 {filteredDeals.length === 0 ? (
 <div className="py-12 text-center border-2 border-dashed border-black bg-white">
 <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
 <p className="text-black font-bold uppercase tracking-wider">NO DEALS FOUND</p>
 </div>
 ) : (
 <div className="space-y-6">
 {filteredDeals.map(deal => (
 <div key={deal.id} className="bg-white border-2 border-black p-6 hover:bg-gray-50 transition-all flex flex-col gap-4">
 {/* Top Badges */}
 <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
 <span className="px-3 py-1 bg-white text-black border-2 border-black flex items-center gap-1.5">
 <div className={`w-2 h-2 border border-black ${deal.status ==='diligence' ?'bg-blue-500' :'bg-[#CC0000]'}`} />
 Status: {deal.status}
 </span>
 <span className="px-3 py-1 bg-white text-black border-2 border-black">
 Technology
 </span>
 <div className="hidden md:block flex-1" />
 <span className="px-3 py-1 bg-white text-black border-2 border-black">
 EV: ${deal.ev}M
 </span>
 <span className="px-3 py-1 bg-white text-black border-2 border-black flex items-center gap-1.5">
 🇺🇸 Country: US
 </span>
 <span className="px-3 py-1 bg-white text-black border-2 border-black">
 Date: {new Date(deal.createdAt).toLocaleDateString('en-US', { month:'short', year:'numeric'})}
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
 <div className="flex flex-col md:flex-row md:items-center gap-3 pt-4 border-t-2 border-black mt-2">
 <Link to={`/deals/${deal.id}`} className="w-full md:w-auto">
 <Button className="bg-[#CC0000] hover:bg-red-700 text-white gap-2 w-full md:w-auto border-2 border-black">
 <ArrowRight className="w-4 h-4" /> View Deal Room
 </Button>
 </Link>
 <div className="hidden md:block flex-1" />
 <Link to={`/deals/${deal.id}`} className="w-full md:w-auto">
 <Button variant="outline" className="gap-2 w-full md:w-auto border-2 border-black">
 <FileText className="w-4 h-4" /> Memos
 </Button>
 </Link>
 <Link to={`/deals/${deal.id}`} className="w-full md:w-auto">
 <Button variant="outline" className="gap-2 w-full md:w-auto border-2 border-black">
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
 <div className="bg-white border-4 border-black w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
 {isCreating ?'Creating...' :'Initialize Deal Room'}
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
