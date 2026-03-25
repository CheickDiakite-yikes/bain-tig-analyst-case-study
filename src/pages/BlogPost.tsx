import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrainCircuit, ArrowLeft, Calendar, User as UserIcon } from 'lucide-react';
import { blogPosts } from './Blogs';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blogs" />;
  }

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
            <Link to="/blogs" className="font-bold uppercase tracking-wider text-sm hover:text-[#CC0000] transition-colors">All Blogs</Link>
            <Link to="/login" className="font-bold uppercase tracking-wider text-sm hover:text-[#CC0000] transition-colors">Login</Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/blogs" className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-gray-500 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-wider text-gray-500 border-y-2 border-black py-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                {post.author}
              </div>
            </div>
          </div>

          <div className="w-full h-64 md:h-96 border-2 border-black mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#CC0000] prose-a:font-bold prose-strong:font-black text-gray-800">
            {slug === 'meet-tiggy' && (
              <>
                <p className="lead text-2xl font-medium border-l-4 border-[#CC0000] pl-6 mb-8">
                  In the fast-paced world of Private Equity and M&A, the due diligence phase is often the bottleneck. It's a grueling process of sifting through thousands of documents, identifying risks, and synthesizing data into actionable insights. Enter TIGGY.
                </p>

                <h2>The Diligence Dilemma</h2>
                <p>
                  For decades, top-tier consulting firms and investment banks have relied on armies of analysts to manually review data rooms. This approach is not only expensive and time-consuming but also prone to human error. Critical red flags can easily be missed in the sheer volume of information.
                </p>
                <p>
                  We built TIGGY to solve this exact problem. TIGGY is an AI Copilot specifically engineered for the high-stakes environment of M&A deal execution.
                </p>

                <h2>What is TIGGY?</h2>
                <p>
                  TIGGY is a highly secure, multi-tenant Deal Management platform powered by Google's Gemini 3.1 Pro. It acts as an autonomous agent within your deal room, capable of analyzing complex financial models, codebases, and legal documents in seconds.
                </p>

                <h2>Key Benefits</h2>
                <ul>
                  <li><strong>10x Faster Diligence:</strong> What used to take weeks now takes hours. TIGGY instantly synthesizes data room contents, allowing your team to focus on strategic decision-making rather than manual data extraction.</li>
                  <li><strong>Automated Risk Scoring:</strong> Our proprietary models identify potential liabilities, tech debt, and market risks, highlighting them before they become deal-breakers.</li>
                  <li><strong>Enterprise-Grade Security:</strong> We understand that confidentiality is paramount. TIGGY operates in an isolated, SOC 2 & ISO 27001 compliant sandbox. We employ a strict Zero-Data-Retention policy—your proprietary data is never used to train public models.</li>
                  <li><strong>Real-Time Collaboration:</strong> Work seamlessly with your deal team in a synchronous multiplayer environment.</li>
                </ul>

                <h2>How It Works</h2>
                <p>
                  The workflow is simple yet powerful:
                </p>
                <ol>
                  <li><strong>Secure Ingestion:</strong> Upload your confidential data room files into your firm's isolated tenant.</li>
                  <li><strong>AI Synthesis:</strong> Ask TIGGY complex questions about the target company. The AI will analyze the documents and provide grounded, cited answers.</li>
                  <li><strong>Actionable Insights:</strong> Generate investment memos, risk reports, and architecture validations with a single click.</li>
                </ol>

                <h2>The Future of M&A</h2>
                <p>
                  TIGGY isn't just a tool; it's a paradigm shift in how deals are evaluated and executed. By augmenting your team with an AI Copilot, you gain an unparalleled edge in the market.
                </p>
                <p>
                  Ready to accelerate your diligence? <Link to="/login">Access the portal today</Link>.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
