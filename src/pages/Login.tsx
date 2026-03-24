import { useState} from'react';
import { signInWithPopup, GoogleAuthProvider} from'firebase/auth';
import { auth, db} from'../firebase';
import { doc, setDoc, getDoc} from'firebase/firestore';
import { Button} from'../components/ui/Button';
import { BrainCircuit} from'lucide-react';

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
 const userRef = doc(db,'users', user.uid);
 const userSnap = await getDoc(userRef);
 
 if (!userSnap.exists()) {
 await setDoc(userRef, {
 email: user.email,
 displayName: user.displayName,
 photoURL: user.photoURL,
 role:'consultant', // Default role
 createdAt: new Date().toISOString()
});
}
} catch (err: any) {
 console.error(err);
 setError(err.message ||'Failed to sign in');
} finally {
 setLoading(false);
}
};

 return (
 <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F0] text-black p-4">
 <div className="w-full max-w-md space-y-8">
 <div className="flex flex-col items-center text-center space-y-4">
 <div className="bg-[#CC0000] p-4 border-2 border-black">
 <BrainCircuit className="w-12 h-12 text-white" />
 </div>
 <h1 className="text-3xl font-bold tracking-tight uppercase">Bain Tech DD AI</h1>
 <p className="text-gray-600 font-bold uppercase tracking-wider">Agentic AI Analyst for Private Equity Due Diligence</p>
 </div>

 <div className="bg-white p-8 border-2 border-black space-y-6">
 {error && (
 <div className="p-3 bg-red-100 border-2 border-[#CC0000] text-[#CC0000] font-bold uppercase tracking-wider text-sm">
 {error}
 </div>
 )}
 
 <Button 
 onClick={handleLogin} 
 disabled={loading}
 className="w-full h-12 text-base font-bold uppercase tracking-wider bg-[#CC0000] text-white border-2 border-black hover:bg-red-700 transition-all"
>
 {loading ?'Connecting...' :'Sign in with Google'}
 </Button>
 
 <p className="text-xs text-center text-gray-500 font-bold uppercase tracking-wider">
 Authorized personnel only. Access is monitored and logged.
 </p>
 </div>
 </div>
 </div>
 );
}
