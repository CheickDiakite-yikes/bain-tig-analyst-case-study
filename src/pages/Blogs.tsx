import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Calendar } from 'lucide-react';
import Footer from '../components/Footer';

export const blogPosts = [
  {
    slug: 'meet-tiggy',
    title: 'Welcome Bain! Meet TIGGY: The AI Copilot Revolutionizing Tech Due Diligence',
    excerpt: 'Designed specifically for Bain TIG professionals, TIGGY accelerates tech due diligence, automates risk scoring for architecture and cyber, and provides a secure, SOC 2 compliant environment for your deal teams.',
    date: 'March 25, 2026',
    author: 'TIGGY Team',
    imageUrl: 'https://picsum.photos/seed/tiggy-blog-1/800/400?blur=1'
  },
  {
    slug: 'building-tiggy-case-study',
    title: 'Building TIGGY: A Case Study in AI-Native Engineering & Gemini API',
    excerpt: 'A deep dive into our engineering journey. We explore the wins of rapid domain adaptation, the friction of bleeding-edge ecosystems, and the core challenge of mastering instruction following with the Gemini API.',
    date: 'March 25, 2026',
    author: 'TIGGY Engineering',
    imageUrl: 'https://picsum.photos/seed/tiggy-engineering/800/400?blur=1'
  }
];

export default function Blogs() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-sans selection:bg-[#CC0000] selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <BrainCircuit className="w-8 h-8 text-[#CC0000] group-hover:rotate-12 transition-transform" />
            <span className="font-black text-2xl uppercase tracking-tighter">TIGGY</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="font-bold uppercase tracking-wider text-sm hover:text-[#CC0000] transition-colors">Login</Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 border-b-4 border-black pb-8"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">The <span className="text-[#CC0000]">Insights</span></h1>
          <p className="text-xl font-medium text-gray-600 border-l-4 border-[#CC0000] pl-4 max-w-2xl">
            Thoughts, updates, and deep dives into the future of AI-driven M&A due diligence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.div 
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border-2 border-black flex flex-col group hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="h-48 border-b-2 border-black overflow-hidden relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-3 line-clamp-2 group-hover:text-[#CC0000] transition-colors">{post.title}</h2>
                <p className="text-gray-600 font-medium text-sm mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
                <Link 
                  to={`/blogs/${post.slug}`}
                  className="inline-flex items-center gap-2 font-black uppercase tracking-wider text-sm text-black group-hover:text-[#CC0000] transition-colors mt-auto"
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
