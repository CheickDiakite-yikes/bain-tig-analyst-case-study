import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { BrainCircuit, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists, if not create profile
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'consultant', // Default role
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-[#CC0000] selection:text-white font-sans">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden border-r-4 border-black">
        {/* Background Pattern/Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#CC0000]"></div>
        <div className="absolute -right-20 -bottom-20 opacity-10">
          <BrainCircuit className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-[#CC0000] p-2 border-2 border-white">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <span className="font-black text-2xl uppercase tracking-widest">TIGGY</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              The Standard <br />
              <span className="text-[#CC0000]">For Tech DD.</span>
            </h1>
            <p className="text-xl font-medium text-gray-400 max-w-md leading-relaxed border-l-4 border-[#CC0000] pl-6">
              Agentic AI designed exclusively for top-tier Private Equity and Strategy Consulting.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-6 border-t-2 border-gray-800 pt-8">
            <div>
              <h4 className="font-black uppercase tracking-wider text-[#CC0000] mb-2">Secure</h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">SOC2 Compliant Sandbox</p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-wider text-[#CC0000] mb-2">Fast</h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">10x Diligence Velocity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f5f5f0] p-6 relative">
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <BrainCircuit className="w-6 h-6 text-[#CC0000]" />
          <span className="font-black text-lg uppercase tracking-widest">TIGGY</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Client Portal</h2>
              <p className="text-gray-600 font-bold uppercase tracking-wider text-sm">Authorized Personnel Only</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-[#CC0000] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#CC0000] shrink-0 mt-0.5" />
                <span className="text-[#CC0000] font-bold uppercase tracking-wider text-xs leading-relaxed">
                  {error}
                </span>
              </div>
            )}
            
            <div className="space-y-6">
              <button 
                onClick={handleLogin} 
                disabled={loading}
                className="w-full group relative flex items-center justify-center gap-3 bg-white text-black border-4 border-black p-4 font-black uppercase tracking-wider hover:bg-[#CC0000] hover:text-white hover:border-[#CC0000] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black disabled:hover:border-black disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                {loading ? (
                  'Connecting...'
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:fill-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" className="group-hover:fill-white transition-colors" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" className="group-hover:fill-white transition-colors" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" className="group-hover:fill-white transition-colors" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" className="group-hover:fill-white transition-colors" />
                    </svg>
                    Continue with Google
                    <ArrowRight className="w-5 h-5 ml-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-10 pt-6 border-t-2 border-gray-200">
              <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                Protected by enterprise-grade encryption. <br/> Access is strictly monitored and logged.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
