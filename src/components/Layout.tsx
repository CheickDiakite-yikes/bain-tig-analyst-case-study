import { useState} from'react';
import { Outlet, Link, useLocation} from'react-router-dom';
import { User, signOut} from'firebase/auth';
import { auth} from'../firebase';
import { LayoutDashboard, LogOut, BrainCircuit, ChevronLeft, ChevronRight, Menu} from'lucide-react';

export default function Layout({ user}: { user: User}) {
 const location = useLocation();
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 return (
 <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden">
 {/* Mobile Overlay */}
 {isSidebarOpen && (
 <div 
 className="fixed inset-0 bg-black/50 z-20 md:hidden"
 onClick={() => setIsSidebarOpen(false)}
 />
 )}

 {/* Sidebar */}
 <aside 
 className={`${
 isSidebarOpen ?'translate-x-0 w-64' :'-translate-x-full w-64 md:translate-x-0 md:w-20'
} transition-all duration-300 border-r-2 border-black bg-white flex flex-col z-30 fixed md:relative h-full`}
>
 <button 
 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
 className="hidden md:block absolute -right-3.5 top-8 bg-white border-2 border-black rounded-sm p-1 z-30 hover:bg-gray-100"
>
 {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
 </button>

 <div className={`p-6 flex items-center gap-3 border-b-2 border-black h-[88px] ${isSidebarOpen ?'' :'md:justify-center px-2'}`}>
 <div className="bg-[#CC0000] p-2 border-2 border-black shrink-0">
 <BrainCircuit className="w-6 h-6 text-white" />
 </div>
 <div className={`overflow-hidden transition-opacity duration-300 ${isSidebarOpen ?'opacity-100' :'md:opacity-0 md:hidden'}`}>
 <h1 className="font-bold text-lg tracking-tight text-black uppercase whitespace-nowrap">Bain Tech DD</h1>
 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold whitespace-nowrap">Agentic AI</p>
 </div>
 </div>
 
 <nav className="flex-1 p-4 space-y-2 overflow-hidden">
 <Link
 to="/"
 onClick={() => setIsSidebarOpen(false)}
 className={`flex items-center gap-3 py-2 font-bold uppercase tracking-wider text-sm transition-all border-2 ${
 location.pathname ==='/' ?'bg-[#CC0000] text-white border-black' :'border-transparent text-gray-600 hover:text-black hover:border-black'
} ${isSidebarOpen ?'px-3' :'md:justify-center px-3 md:px-0'}`}
 title="Pipeline"
>
 <LayoutDashboard className="w-5 h-5 shrink-0" />
 <span className={`whitespace-nowrap ${isSidebarOpen ?'block' :'md:hidden'}`}>Pipeline</span>
 </Link>
 </nav>

 <div className="p-4 border-t-2 border-black overflow-hidden">
 <div className={`flex items-center gap-3 mb-4 ${isSidebarOpen ?'px-3' :'md:justify-center px-3 md:px-0'}`}>
 <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=CC0000&color=fff`} alt="Avatar" className="w-8 h-8 border-2 border-black shrink-0" referrerPolicy="no-referrer" />
 <div className={`overflow-hidden ${isSidebarOpen ?'block' :'md:hidden'}`}>
 <p className="text-sm font-bold truncate text-black">{user.displayName || user.email}</p>
 <p className="text-xs text-gray-500 uppercase tracking-wider font-bold truncate">Consultant</p>
 </div>
 </div>
 <button
 onClick={() => signOut(auth)}
 className={`flex items-center gap-3 py-2 w-full font-bold uppercase tracking-wider text-sm text-gray-600 hover:text-[#CC0000] hover:bg-red-50 border-2 border-transparent hover:border-black transition-all ${isSidebarOpen ?'px-3' :'md:justify-center px-3 md:px-0'}`}
 title="Sign Out"
>
 <LogOut className="w-5 h-5 shrink-0" />
 <span className={`whitespace-nowrap ${isSidebarOpen ?'block' :'md:hidden'}`}>Sign Out</span>
 </button>
 </div>
 </aside>

 {/* Main Content */}
 <main className="flex-1 overflow-hidden flex flex-col bg-[#F4F4F0] relative">
 {/* Mobile Header */}
 <div className="md:hidden flex items-center p-4 border-b-2 border-black bg-white shrink-0">
 <button onClick={() => setIsSidebarOpen(true)} className="p-2 border-2 border-black bg-white">
 <Menu className="w-5 h-5" />
 </button>
 <div className="ml-4 font-bold uppercase tracking-wider">Bain Tech DD</div>
 </div>
 <div className="flex-1 overflow-auto p-4 md:p-8 relative flex flex-col">
 <Outlet />
 </div>
 </main>
 </div>
 );
}
