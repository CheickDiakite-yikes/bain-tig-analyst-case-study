import { BrainCircuit, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Terms() {
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
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Terms of <span className="text-[#CC0000]">Service</span></h1>
            <p className="text-xl font-medium text-gray-600 border-l-4 border-[#CC0000] pl-4">
              Enterprise License Agreement.
            </p>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mt-4">Last Updated: March 2026</p>
          </div>

          <div className="space-y-12">
            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  By accessing or using the TIGGY platform, you agree to be bound by these Terms of Service. If you are using the platform on behalf of a Private Equity firm, Consulting firm, or other organization, you represent that you have the authority to bind that organization to these terms.
                </p>
              </div>
            </section>

            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">2. Enterprise License</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  TIGGY grants your organization a limited, non-exclusive, non-transferable license to access and use the platform solely for internal due diligence, market analysis, and deal execution purposes.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Authorized Personnel Only:</strong> Access is restricted to authorized employees and contractors of your firm.</li>
                  <li><strong>No Resale:</strong> You may not resell, sublicense, or otherwise make the platform available to third parties outside of your organization.</li>
                </ul>
              </div>
            </section>

            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">3. User Conduct</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reverse engineer, decompile, or disassemble any part of the TIGGY platform or its underlying AI models.</li>
                  <li>Attempt to gain unauthorized access to other tenants' data or the platform's infrastructure.</li>
                  <li>Use the platform to process illegal, harmful, or highly regulated data (e.g., PHI) without prior written consent and appropriate agreements (e.g., BAA).</li>
                </ul>
              </div>
            </section>

            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">4. Intellectual Property</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  <strong>Your Data:</strong> You retain all ownership and intellectual property rights to the data, documents, and codebases you upload to the platform.
                </p>
                <p>
                  <strong>TIGGY Platform:</strong> TIGGY retains all ownership and intellectual property rights to the platform, its underlying AI models, algorithms, and generated insights (excluding your underlying data).
                </p>
              </div>
            </section>

            <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#CC0000]">5. Limitation of Liability</h2>
              <div className="space-y-4 text-lg font-medium text-gray-700 leading-relaxed">
                <p>
                  The TIGGY platform is provided "as is" and "as available." While our AI is designed to assist with due diligence, it is not a substitute for professional financial, legal, or technical advice.
                </p>
                <p>
                  TIGGY shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or related to your use of the platform or reliance on its generated memos.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
