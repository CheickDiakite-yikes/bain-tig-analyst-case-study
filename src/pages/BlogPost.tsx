import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrainCircuit, ArrowLeft, Calendar, User as UserIcon } from 'lucide-react';
import { blogPosts } from './Blogs';
import Footer from '../components/Footer';

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
                  Welcome to the future of Technology Due Diligence. For Bain TIG (Technology & Innovation Group) professionals, the 3-week sprint of a PE deal is a familiar battle. It's a grueling process of sifting through thousands of documents, assessing tech stacks, and synthesizing data into actionable investment thesis insights. Enter TIGGY.
                </p>

                <h2>The Tech Diligence Dilemma</h2>
                <p>
                  As a Bain consultant, you know that evaluating a target company's software architecture, cybersecurity posture, and IT organization requires deep expertise and massive amounts of time. You're tasked with finding the hidden technical debt, assessing scalability, and identifying value creation levers—all under a tight exclusivity window.
                </p>
                <p>
                  Relying solely on manual review of VDRs (Virtual Data Rooms) is no longer enough. Critical red flags in open-source licenses, hidden vulnerabilities in SOC 2 reports, or monolithic bottlenecks in architecture diagrams can easily be buried in the sheer volume of information. We built TIGGY to solve this exact problem.
                </p>

                <h2>What is TIGGY?</h2>
                <p>
                  TIGGY is a highly secure, multi-tenant Deal Management platform powered by Google's Gemini 3.1 Pro. It acts as an autonomous agent within your deal room, specifically engineered to augment Bain TIG consultants by analyzing complex financial models, codebases, and legal documents in seconds.
                </p>

                <h2>Key Benefits for Bain Professionals</h2>
                <ul>
                  <li><strong>10x Faster Synthesis:</strong> Instantly parse AWS/Azure architecture diagrams, codebase scans, and IT budgets. TIGGY extracts the signal from the noise, allowing you to focus on strategic advisory rather than manual data extraction.</li>
                  <li><strong>Automated Risk & Cyber Scoring:</strong> Our proprietary models identify potential liabilities, tech debt, and cybersecurity risks (like missing SOC 2 controls or outdated dependencies), highlighting them before they become deal-breakers.</li>
                  <li><strong>Enterprise-Grade Security (Bain Standard):</strong> We understand that PE confidentiality is paramount. TIGGY operates in an isolated, SOC 2 & ISO 27001 compliant sandbox. We employ a strict Zero-Data-Retention policy—your proprietary deal data is never used to train public models.</li>
                  <li><strong>Seamless Deal Team Collaboration:</strong> Work synchronously with your Partners, Managers, and external SMEs in a multiplayer environment designed for high-stakes deal execution.</li>
                </ul>

                <h2>How It Augments Your Workflow</h2>
                <p>
                  The workflow is designed to fit seamlessly into the Bain DD methodology:
                </p>
                <ol>
                  <li><strong>Secure Ingestion:</strong> Upload the target's confidential data room files (architecture docs, code scans, IT org charts) into your firm's isolated tenant.</li>
                  <li><strong>AI-Powered Interrogation:</strong> Ask TIGGY complex questions like, <em>"Summarize the key findings from the Veracode scan"</em> or <em>"Identify any single points of failure in the infrastructure diagram."</em> The AI will analyze the documents and provide grounded, cited answers.</li>
                  <li><strong>Actionable Insights & IC Memos:</strong> Generate draft sections for your Investment Committee (IC) memos, risk reports, and architecture validations with a single click, ready for your expert refinement.</li>
                </ol>

                <h2>The Future of M&A Advisory</h2>
                <p>
                  TIGGY isn't just a tool; it's a paradigm shift in how tech due diligence is executed. By augmenting your TIG team with an AI Copilot, you deliver deeper insights, faster, giving your Private Equity clients an unparalleled edge in the market.
                </p>
                <p>
                  Ready to accelerate your diligence? <Link to="/login">Access the portal today</Link>.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
