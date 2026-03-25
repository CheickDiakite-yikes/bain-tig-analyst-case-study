import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, CheckCircle2, BarChart3, FileText, BrainCircuit, ShieldCheck, Lock, Server, GitBranch, TrendingUp, Building2, Database, FileLock2 } from 'lucide-react';
import { useState } from 'react';
import Footer from '../components/Footer';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 border-black">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
      >
        <span className="font-bold text-lg uppercase tracking-wider">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-gray-700 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

const PlatformDemo = () => {
  return (
    <section className="py-24 bg-[#CC0000] border-y-2 border-black px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 text-white">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">See TIGGY in Action</h2>
          <p className="text-xl font-medium opacity-90 max-w-2xl mx-auto">Automated tech due diligence at the speed of thought. Watch as TIGGY analyzes codebases and architectures in real-time.</p>
        </div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden flex flex-col max-w-5xl mx-auto"
        >
          {/* Browser Header */}
          <div className="bg-gray-100 border-b-2 border-black px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#CC0000] border border-black"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
            <div className="ml-4 bg-white border-2 border-black px-4 py-1 text-xs font-bold uppercase tracking-widest flex-1 text-center text-gray-400 max-w-md mx-auto truncate">tiggy.bain.com/deal-room/apollo</div>
          </div>
          
          {/* App Body */}
          <div className="flex h-[400px] md:h-[500px]">
            {/* Sidebar */}
            <div className="w-48 md:w-64 border-r-2 border-black bg-[#f5f5f0] p-4 hidden sm:block">
              <div className="flex items-center gap-2 mb-8">
                <BrainCircuit className="w-6 h-6 text-[#CC0000]" />
                <span className="font-black text-lg uppercase tracking-widest">TIGGY</span>
              </div>
              <div className="space-y-3">
                <div className="h-10 bg-black text-white text-xs font-bold uppercase flex items-center px-3 border-2 border-black">Project Apollo</div>
                <div className="h-10 bg-white text-gray-500 text-xs font-bold uppercase flex items-center px-3 border-2 border-transparent">Project Zeus</div>
                <div className="h-10 bg-white text-gray-500 text-xs font-bold uppercase flex items-center px-3 border-2 border-transparent">Project Athena</div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 bg-white overflow-hidden relative">
              <div className="flex justify-between items-end border-b-2 border-black pb-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Project Apollo</h3>
                  <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Tech Stack & Architecture Review</p>
                </div>
                <div className="hidden md:flex gap-2">
                  <motion.div 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="px-3 py-1 bg-[#CC0000] text-white text-xs font-bold uppercase border-2 border-black"
                  >
                    Analyzing...
                  </motion.div>
                </div>
              </div>
              
              <div className="flex-1 grid md:grid-cols-2 gap-8">
                {/* Left: AI Typing Memo */}
                <div className="space-y-4 relative flex flex-col justify-center">
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "100%" }} 
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-3 bg-gray-200 border border-black"
                  />
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "85%" }} 
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                    className="h-3 bg-gray-200 border border-black"
                  />
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "95%" }} 
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                    className="h-3 bg-gray-200 border border-black"
                  />
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "60%" }} 
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
                    className="h-3 bg-gray-200 border border-black"
                  />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                    className="mt-6 p-4 bg-[#f5f5f0] border-2 border-black relative"
                  >
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#CC0000] border-2 border-black flex items-center justify-center">
                      <span className="text-white text-[10px] font-black">!</span>
                    </div>
                    <p className="text-xs font-black uppercase text-[#CC0000] mb-2 tracking-wider">Key Risk Identified</p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">Significant technical debt in core monolithic billing service. Migration to microservices is 18 months behind schedule.</p>
                  </motion.div>
                </div>
                
                {/* Right: Animated Chart */}
                <div className="border-2 border-black p-4 flex flex-col justify-end h-full relative bg-gray-50 hidden md:flex">
                  <p className="absolute top-4 left-4 text-xs font-black uppercase tracking-wider text-gray-500">Tech Debt vs Velocity</p>
                  <div className="flex items-end justify-around h-48 gap-3 mt-8">
                    {[40, 60, 80, 45, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 + (i * 0.15), type: "spring", bounce: 0.4 }}
                        className={`w-full border-2 border-black ${i === 4 ? 'bg-[#CC0000]' : 'bg-black'}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 border-t-2 border-black pt-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Q1</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">Q2</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">Q3</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">Q4</span>
                    <span className="text-[10px] font-black uppercase text-[#CC0000]">NOW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const DealArchetypes = () => {
  return (
    <section className="py-24 bg-[#f5f5f0] border-y-2 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Built for Every Deal Context</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">TIGGY adapts to the specific thesis and risks of your transaction archetype.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <GitBranch className="w-10 h-10" />,
              title: "Carve-outs",
              desc: "Analyzing entanglement, shared services, and standalone costs to ensure a clean separation."
            },
            {
              icon: <TrendingUp className="w-10 h-10" />,
              title: "Growth Equity",
              desc: "Auditing scalability, architecture bottlenecks, and engineering velocity for rapid expansion."
            },
            {
              icon: <Building2 className="w-10 h-10" />,
              title: "LBOs",
              desc: "Identifying technical debt, cost-reduction opportunities, and post-close integration risks."
            }
          ].map((archetype, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white border-4 border-black p-8 relative group hover:-translate-y-2 hover:translate-x-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="w-20 h-20 bg-[#f5f5f0] border-4 border-black flex items-center justify-center mb-8 group-hover:bg-[#CC0000] group-hover:text-white transition-colors duration-300 text-black">
                {archetype.icon}
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{archetype.title}</h3>
              <p className="text-lg font-medium leading-relaxed text-gray-700">{archetype.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SecurityVault = () => {
  return (
    <section className="py-24 bg-black text-white border-y-2 border-black relative overflow-hidden">
      {/* Animated background element */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        className="absolute -top-64 -right-64 opacity-5 pointer-events-none"
      >
        <ShieldCheck className="w-[800px] h-[800px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
          <div className="flex-1">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              The <span className="text-[#CC0000]">Vault.</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed border-l-4 border-[#CC0000] pl-6">
              In Private Equity, data room confidentiality is paramount. TIGGY is engineered from the ground up to exceed enterprise and financial institution security standards (SOC 2, ISO 27001).
            </p>
          </div>
          <div className="w-40 h-40 bg-[#CC0000] border-4 border-white flex items-center justify-center relative shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] shrink-0">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Lock className="w-20 h-20 text-white" />
            </motion.div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8" />,
              title: "SOC 2 & ISO 27001",
              desc: "Fully certified and compliant infrastructure, ensuring your sensitive deal data is protected by rigorous financial institution security controls."
            },
            {
              icon: <FileLock2 className="w-8 h-8" />,
              title: "Zero-Data-Retention",
              desc: "Our models are never trained on your proprietary data room documents. What happens in the vault, stays in the vault."
            },
            {
              icon: <Server className="w-8 h-8" />,
              title: "Isolated Tenants",
              desc: "Every firm operates in a completely siloed environment. No cross-contamination, no shared databases, absolute privacy."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-[#111] border-2 border-gray-800 p-8 hover:border-[#CC0000] transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-black border-2 border-gray-700 flex items-center justify-center mb-6 text-[#CC0000]">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">{feature.title}</h3>
              <p className="font-medium leading-relaxed text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-sans selection:bg-[#CC0000] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#f5f5f0] border-b-2 border-black z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-[#CC0000]" />
            <span className="font-black text-xl uppercase tracking-widest">TIGGY</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="font-bold uppercase tracking-wider hover:text-[#CC0000] transition-colors hidden md:block">
              Client Portal
            </Link>
            <Link to="/login" className="bg-black text-white px-6 py-2 font-bold uppercase tracking-wider border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(204,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(204,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:pt-48 md:pb-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              The New Age of <span className="text-[#CC0000]">Tech-Driven</span> Consulting.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-700 mb-10 leading-snug border-l-4 border-[#CC0000] pl-6">
              We combine deep industry expertise with advanced AI to accelerate due diligence, thesis generation, and deal execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-[#CC0000] text-white px-8 py-4 font-bold text-lg uppercase tracking-wider border-2 border-black hover:bg-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]">
                Enter Deal Room <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#CC0000] translate-x-4 translate-y-4 border-2 border-black"></div>
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative bg-white border-2 border-black p-8 h-full flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="font-mono text-sm font-bold bg-gray-100 px-3 py-1 border-2 border-black uppercase">Live Analysis</span>
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Project Soulz</h3>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 w-3/4 border border-black"></div>
                  <div className="h-4 bg-gray-200 w-full border border-black"></div>
                  <div className="h-4 bg-gray-200 w-5/6 border border-black"></div>
                </div>
                <div className="mt-8 flex gap-2">
                  <span className="inline-block px-3 py-1 bg-[#CC0000] text-white text-xs font-bold uppercase tracking-wider border border-black">AI Verified</span>
                  <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider border border-black">High Conviction</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About TIGGY Section */}
      <section className="py-24 bg-white border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Built for the <br/><span className="text-[#CC0000]">TIG Group.</span></h2>
              <p className="text-xl text-gray-700 font-medium leading-relaxed mb-6">
                TIGGY is the ultimate weapon for Technology & Innovation Groups. We've distilled decades of tech due diligence expertise into an autonomous AI agent.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Stop wasting days manually parsing architecture diagrams and AWS bills. TIGGY ingests your data room, identifies technical debt, evaluates team velocity, and outputs investment-committee-ready memos in minutes.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-black translate-x-4 translate-y-4 border-2 border-black"></div>
              <div className="relative bg-[#f5f5f0] border-2 border-black p-8 md:p-12">
                <BrainCircuit className="w-16 h-16 text-[#CC0000] mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">The TIGGY Advantage</h3>
                <ul className="space-y-4 font-bold uppercase tracking-wider text-sm">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#CC0000]" /> 10x Faster Diligence</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#CC0000]" /> Automated Risk Scoring</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#CC0000]" /> Architecture Validation</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#CC0000]" /> SOC 2 & ISO 27001 Sandbox</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <PlatformDemo />

      {/* Marquee Section */}
      <section className="py-6 bg-black text-white border-y-2 border-black overflow-hidden flex whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          className="flex gap-12 items-center text-lg md:text-xl font-black uppercase tracking-widest w-max"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <span>Tech Due Diligence</span>
              <span className="text-[#CC0000]">///</span>
              <span>AI Readiness</span>
              <span className="text-[#CC0000]">///</span>
              <span>Vibecode Analysis</span>
              <span className="text-[#CC0000]">///</span>
              <span>Architecture Review</span>
              <span className="text-[#CC0000]">///</span>
              <span>Moat Analysis</span>
              <span className="text-[#CC0000]">///</span>
              <span>Codebase Analysis</span>
              <span className="text-[#CC0000]">///</span>
              <span>Cybersecurity Audit</span>
              <span className="text-[#CC0000]">///</span>
              <span>Scalability Assessment</span>
              <span className="text-[#CC0000]">///</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features/Tutorial Section */}
      <section className="py-24 bg-white border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">How TIGGY Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">A streamlined, AI-powered approach to evaluating assets and executing deals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "1. Secure Ingestion",
                desc: "Upload confidential data room files into our isolated, SOC 2 & ISO 27001 compliant environment. Your data never trains public models."
              },
              {
                icon: <BrainCircuit className="w-8 h-8" />,
                title: "2. AI Synthesis",
                desc: "Our proprietary models instantly analyze financials, tech stacks, and market positioning to identify moats and red flags."
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "3. Actionable Memos",
                desc: "Generate investment committee-ready memos, complete with charts and citations, exportable to PDF and Word instantly."
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-[#f5f5f0] border-2 border-black p-8 relative group hover:bg-black hover:text-white transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mb-6 group-hover:bg-[#CC0000] group-hover:border-[#CC0000] group-hover:text-white transition-colors duration-300 text-black">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{step.title}</h3>
                <p className="font-medium leading-relaxed opacity-80">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Archetypes Section */}
      <DealArchetypes />

      {/* Security Vault Section */}
      <SecurityVault />

      {/* FAQ Section */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 text-center">Frequently Asked Questions</h2>
          <div className="border-t-2 border-black">
            <FAQItem 
              question="Is my data secure and private?" 
              answer="Absolutely. We use enterprise-grade encryption and isolated environments. Your uploaded documents are never used to train public AI models. We adhere to the strictest confidentiality standards expected by top-tier private equity and consulting firms."
            />
            <FAQItem 
              question="What types of files can I upload to the Data Room?" 
              answer="You can upload PDFs, Word documents, Excel spreadsheets, CSVs, and plain text files. Our system automatically parses and indexes these documents for instant AI-assisted querying."
            />
            <FAQItem 
              question="How accurate is the AI analysis?" 
              answer="Our AI acts as an incredibly fast analyst, but it is designed to augment, not replace, human judgment. Every claim generated in a memo is grounded in the source documents you provide, allowing you to easily verify the information."
            />
            <FAQItem 
              question="Can I export the generated reports?" 
              answer="Yes. All memos and reports can be instantly exported to professionally formatted PDF or Microsoft Word documents, ready for your investment committee or client presentations."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#CC0000] text-white border-y-2 border-black text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">Ready to accelerate your diligence?</h2>
          <p className="text-xl md:text-2xl font-medium mb-12 opacity-90">Join the top firms using TIGGY to gain an edge in deal execution.</p>
          <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white text-black px-10 py-5 font-black text-xl uppercase tracking-wider border-4 border-black hover:bg-black hover:text-white hover:border-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[8px] hover:translate-y-[8px]">
            Access Portal <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
