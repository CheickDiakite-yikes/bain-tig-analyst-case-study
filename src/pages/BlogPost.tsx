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

          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#CC0000] prose-a:font-bold prose-strong:font-black text-gray-800 prose-pre:overflow-x-auto prose-pre:max-w-full break-words">
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

            {slug === 'building-tiggy-case-study' && (
              <>
                <p className="lead text-2xl font-medium border-l-4 border-[#CC0000] pl-6 mb-8">
                  Building an AI-native application for the high-stakes world of Private Equity and M&A is no small feat. In this retrospective case study, we pull back the curtain on the engineering journey behind TIGGY, analyzing our wins, friction points, and the core challenge of mastering the Gemini API.
                </p>

                <h2>1. What Went Right (The Wins)</h2>
                <ul>
                  <li><strong>Rapid Domain Adaptation:</strong> We successfully tailored the application to a highly specific, niche audience (Bain TIG professionals, Private Equity, M&A). The ability to instantly pivot the copywriting and feature set to include industry-specific jargon (VDRs, SOC 2, IC Memos, Tech Debt, Veracode scans) gave the app an immediate enterprise-grade feel.</li>
                  <li><strong>Component Modularity & Refactoring:</strong> When expanding our marketing pages, we successfully executed a classic refactor: extracting the inline footer from the Landing Page into a reusable component. This kept the codebase DRY (Don't Repeat Yourself) and scalable.</li>
                  <li><strong>Design System Consistency:</strong> We maintained a strict, high-contrast, professional UI (black, white, and TIGGY Red) across all new pages. Using modern utility-first CSS and robust iconography allowed us to build complex grids very quickly.</li>
                </ul>

                <h2>2. What We Struggled With (The Friction Points)</h2>
                <p>
                  No build session is without its hurdles. Here are the key friction points we encountered and overcame:
                </p>
                <ul>
                  <li><strong>Ecosystem Churn & "Muscle Memory" Errors:</strong> During the Blogs page build, we initially imported our animation library from the legacy <code>framer-motion</code> package instead of the bleeding-edge <code>motion/react</code> package. This caused a fatal "Invalid hook call" error. <em>The Lesson:</em> AI assistants and engineers alike must rigorously check <code>package.json</code> before assuming import paths in the fast-moving React ecosystem.</li>
                  <li><strong>Tooling Precision:</strong> During a refactor, we initially failed to replace code because our "Target Content" didn't perfectly match the exact whitespace/indentation of the existing file. This highlights that AI coding tools require surgical precision and exact string matching.</li>
                </ul>

                <h2>3. The Gemini API & Instruction Following (The Core Challenge)</h2>
                <p>
                  When building an AI app like TIGGY that relies on analyzing complex documents (codebases, financial models), getting the underlying LLM to do <em>exactly</em> what you want is the hardest part of the engineering process. Here is an analysis of why instruction following is a struggle and how we learn from it:
                </p>
                <ul>
                  <li><strong>The "Chatty AI" Problem:</strong> When you ask an LLM to extract risks from a SOC 2 report, it often wants to add conversational filler ("Here is the analysis you requested..."). In a production app, you need raw, structured data to render in the UI. <em>The Fix:</em> We heavily rely on the new <code>@google/genai</code> SDK's <strong>Structured Outputs</strong>. By forcing the Gemini API to return strict JSON matching a predefined interface, we bypass the instruction-following drift and force deterministic data structures.</li>
                  <li><strong>Context Window Overload vs. Needle in a Haystack:</strong> In M&A diligence, you are feeding the API massive documents. Sometimes, Gemini might struggle to follow a specific instruction (e.g., "Only list critical vulnerabilities") because the instruction gets drowned out by the sheer volume of the 100-page PDF context. <em>The Fix:</em> <strong>System Instructions</strong> are critical. Placing the persona ("You are a Bain TIG consultant") and the strict rules in the system prompt carries much more weight than putting them in the user prompt alongside the document text.</li>
                  <li><strong>SDK Version Confusion:</strong> The Gemini ecosystem recently transitioned to a new unified SDK. A common struggle in AI-assisted coding is hallucinating old SDK methods instead of the new patterns. Strict adherence to the newest documentation is required to prevent runtime crashes.</li>
                </ul>

                <h2>4. Advanced Technical Learnings: Building for AI-Native</h2>
                <p>
                  Beyond the API itself, integrating an LLM into a React frontend requires a fundamental shift in how we approach state, types, and user experience. Here are the key technical lessons we learned:
                </p>
                <ul>
                  <li><strong>Handling AI Latency (UX/UI):</strong> Unlike traditional CRUD apps where database queries take milliseconds, LLM generation can take several seconds—especially when analyzing a 100-page VDR document. We learned that UX is make-or-break here. Implementing skeleton loaders, streaming responses (where possible), and optimistic UI updates are mandatory to keep users engaged and prevent them from thinking the app has frozen during complex diligence queries.</li>
                  <li><strong>End-to-End Type Safety:</strong> When relying on an LLM to generate JSON, TypeScript becomes your best friend and your strict enforcer. We learned to map the Gemini API's <code>responseSchema</code> directly to our frontend TypeScript interfaces. If the AI hallucinates a field or returns a string instead of an array, the type system catches it before it breaks the React render cycle.</li>
                  <li><strong>Client-Side Security Posture:</strong> Building for Private Equity means handling highly confidential data. We had to ensure our frontend state management didn't inadvertently cache sensitive VDR data in local storage or expose it in client-side telemetry. Zero-Data-Retention starts at the UI layer.</li>
                </ul>

                <h2>5. The Final Takeaway: Prompt Engineering as Code</h2>
                <p>
                  Building TIGGY demonstrated that the actual React/UI development is largely a solved problem—we can spin up beautiful, responsive pages in seconds. 
                </p>
                <p>
                  The <em>true</em> engineering challenge of 2026 is <strong>Prompt Engineering as Code</strong>. The success of TIGGY doesn't rely on how nice the dashboard looks; it relies on how strictly we can constrain the Gemini API to follow our exact analytical instructions without hallucinating, formatting incorrectly, or losing the thread during a massive document analysis. Moving forward, our focus remains on hardening those API calls with strict schemas, robust error handling, and clear system instructions.
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
