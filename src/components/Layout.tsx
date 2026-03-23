import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LayoutDashboard, LogOut, BrainCircuit, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Layout({ user }: { user: User }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 border-r-2 border-black bg-white flex flex-col z-20 relative`}
      >
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-8 bg-white border-2 border-black rounded-sm p-1 z-30 hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className={`p-6 flex items-center gap-3 border-b-2 border-black h-[88px] ${isSidebarOpen ? '' : 'justify-center px-2'}`}>
          <div className="bg-[#CC0000] p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg tracking-tight text-black uppercase whitespace-nowrap">Bain Tech DD</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold whitespace-nowrap">Agentic AI</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          <Link
            to="/"
            className={`flex items-center gap-3 py-2 font-bold uppercase tracking-wider text-sm transition-all border-2 ${
              location.pathname === '/' ? 'bg-[#CC0000] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent text-gray-600 hover:text-black hover:border-black'
            } ${isSidebarOpen ? 'px-3' : 'justify-center px-0'}`}
            title="Pipeline"
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Pipeline</span>}
          </Link>
        </nav>

        <div className="p-4 border-t-2 border-black overflow-hidden">
          <div className={`flex items-center gap-3 mb-4 ${isSidebarOpen ? 'px-3' : 'justify-center px-0'}`}>
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=CC0000&color=fff`} alt="Avatar" className="w-8 h-8 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0" referrerPolicy="no-referrer" />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-black">{user.displayName || user.email}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold truncate">Consultant</p>
              </div>
            )}
          </div>
          <button
            onClick={() => signOut(auth)}
            className={`flex items-center gap-3 py-2 w-full font-bold uppercase tracking-wider text-sm text-gray-600 hover:text-[#CC0000] hover:bg-red-50 border-2 border-transparent hover:border-black transition-all ${isSidebarOpen ? 'px-3' : 'justify-center px-0'}`}
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col bg-[#F4F4F0]">
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
