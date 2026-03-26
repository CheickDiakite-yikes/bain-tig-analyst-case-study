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
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import { Button } from './components/ui/Button';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        try {
          // @ts-ignore
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } catch (e) {
          console.error("Failed to check API key status:", e);
          setHasApiKey(true); // Assume true if error
        }
      } else {
        setHasApiKey(true); // Not in AI Studio or not required
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || hasApiKey === null) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">API Key Required</h1>
        <p className="mb-6 max-w-md">
          This application uses advanced Gemini models (like image generation) that require you to select your own Google Cloud API key.
        </p>
        <Button 
          onClick={async () => {
            // @ts-ignore
            if (window.aistudio && window.aistudio.openSelectKey) {
              // @ts-ignore
              await window.aistudio.openSelectKey();
              setHasApiKey(true); // Assume success to avoid race condition
            }
          }}
        >
          Select API Key
        </Button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
        <Route element={user ? <Layout user={user} /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/deals/:dealId" element={<DealRoom user={user} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
