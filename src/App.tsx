import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DealRoom from './pages/DealRoom';
import LandingPage from './pages/LandingPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

function ApiKeyGuard({ children }: { children: React.ReactNode }) {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await (window as any).aistudio?.hasSelectedApiKey();
        setHasKey(!!selected);
      } catch (e) {
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      await (window as any).aistudio?.openSelectKey();
      // Assume successful after triggering as per guidelines
      setHasKey(true);
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message.includes("Requested entity was not found.")) {
        setHasKey(false);
      }
    }
  };

  if (hasKey === null) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading API Key Status...</div>;

  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 border-4 border-black max-w-md text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-4">API Key Required</h1>
          <p className="mb-6 text-gray-600">
            To generate high-quality images and charts for memos, you must select a paid Google Cloud project API key.
            <br/><br/>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">Billing Documentation</a>
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-black text-white font-bold uppercase tracking-wider py-3 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  return (
    <ApiKeyGuard>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={user ? <Layout user={user} /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/deals/:dealId" element={<DealRoom user={user} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiKeyGuard>
  );
}
