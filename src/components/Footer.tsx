import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 flex justify-start">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[#CC0000]" />
            <span className="font-black text-lg uppercase tracking-widest">TIGGY</span>
          </div>
        </div>
        <div className="flex-1 flex justify-center gap-6 text-sm font-bold uppercase tracking-wider text-gray-400">
          <Link to="/blogs" className="hover:text-white transition-colors">Blogs</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="flex-1 flex justify-end text-sm font-medium text-gray-500 text-center md:text-right">
          &copy; {new Date().getFullYear()} TIGGY LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
