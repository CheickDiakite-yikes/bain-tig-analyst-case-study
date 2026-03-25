import { BrainCircuit, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-sans selection:bg-[#CC0000] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#f5f5f0] border-b-2 border-black z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="w-8 h-8 text-[#CC0000]" />
            <span className="font-black text-xl uppercase tracking-widest">TIGGY</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 font-bold uppercase tracking-wider hover:text-[#CC0000] transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 border-b-4 border-black pb-8">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Privacy <span className="text-[#CC0000]">Policy</span></h1>
            <p className="text-xl font-medium text-gray-600 border-l-4 border-[#CC0000] pl-4">
              SOC 2 & ISO 27001 Compliant. Zero-Data-Retention. Your deal data is your own.
            </p>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mt-4">Last Updated: March 2026</p>
          </div>

          <div className="space-y-12">
            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">1. Information We Collect</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  <strong>Account Information:</strong> When you create an account, we collect your name, email address, firm name, and authentication credentials.
                </p>
                <p>
                  <strong>Data Room Uploads:</strong> We temporarily process documents, codebases, and financial models uploaded to the TIGGY platform for the sole purpose of generating due diligence analysis.
                </p>
                <p>
                  <strong>Usage Data:</strong> We collect telemetry data on how you interact with the platform to improve performance and security.
                </p>
              </div>
            </section>

            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">2. Zero-Data-Retention Policy</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  TIGGY operates on a strict Zero-Data-Retention architecture for all AI processing. 
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>No Model Training:</strong> Your proprietary deal data, uploaded documents, and generated memos are <strong>never</strong> used to train our foundational models or any public AI models.</li>
                  <li><strong>Ephemeral Processing:</strong> Data processed by our AI engines is held in memory only for the duration of the analysis and is immediately purged upon completion.</li>
                </ul>
              </div>
            </section>

            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">3. Data Security & Compliance</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  We employ enterprise-grade security measures designed for top-tier Private Equity and Strategy Consulting firms.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>SOC 2 Type II & ISO 27001:</strong> Our infrastructure and operational processes are audited and certified SOC 2 Type II and ISO 27001 compliant.</li>
                  <li><strong>Encryption:</strong> All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</li>
                  <li><strong>Isolated Tenants:</strong> Each client firm operates within a logically isolated tenant environment to prevent cross-contamination.</li>
                </ul>
              </div>
            </section>

            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">4. Third-Party Sharing</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  We do not sell, rent, or trade your personal information or deal data to third parties. We only share information with vetted subprocessors (e.g., secure cloud hosting providers) necessary to provide the TIGGY service, all of whom are bound by strict confidentiality agreements.
                </p>
              </div>
            </section>

            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">5. Contact Us</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy or our security practices, please contact our compliance team at:
                </p>
                <p className="font-bold">privacy@tiggy.com</p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
