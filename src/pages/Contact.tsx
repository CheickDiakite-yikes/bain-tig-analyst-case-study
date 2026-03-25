import { BrainCircuit, ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    firm: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-sans selection:bg-[#CC0000] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#f5f5f0] border-b-2 border-black z-50 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BrainCircuit className="w-8 h-8 text-[#CC0000]" />
          <span className="font-black text-xl uppercase tracking-widest">TIGGY</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 font-bold uppercase tracking-wider hover:text-[#CC0000] transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 border-b-4 border-black pb-8">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Contact <span className="text-[#CC0000]">TIGGY</span></h1>
            <p className="text-xl font-medium text-gray-600 border-l-4 border-[#CC0000] pl-4">
              Get in touch with our enterprise team for a private demo or partnership inquiries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(204,0,0,1)]">
                <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Global Headquarters</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-[#CC0000] shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold uppercase tracking-wider mb-1">New York</h3>
                      <p className="text-gray-400 font-medium leading-relaxed">
                        One World Trade Center<br />
                        Suite 4500<br />
                        New York, NY 10007
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-[#CC0000] shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold uppercase tracking-wider mb-1">Email</h3>
                      <p className="text-gray-400 font-medium">enterprise@tiggy.com</p>
                      <p className="text-gray-400 font-medium">press@tiggy.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-[#CC0000] shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold uppercase tracking-wider mb-1">Phone</h3>
                      <p className="text-gray-400 font-medium">+1 (212) 555-0198</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#CC0000] text-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Support Hours</h3>
                <p className="font-medium opacity-90">
                  Our dedicated enterprise support team is available 24/7 for active deal rooms. General inquiries are answered Monday-Friday, 9am-6pm EST.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                >
                  <div className="w-20 h-20 bg-[#CC0000] border-4 border-black flex items-center justify-center mb-4">
                    <BrainCircuit className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight">Message Received</h3>
                  <p className="text-lg font-medium text-gray-600">
                    Thank you for reaching out. An enterprise director will be in touch shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 bg-black text-white px-6 py-3 font-bold uppercase tracking-wider border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Send a Message</h2>
                  
                  <div className="space-y-2">
                    <label htmlFor="name" className="block font-bold uppercase tracking-wider text-sm">Full Name</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      className="w-full bg-[#f5f5f0] border-2 border-black p-3 font-medium focus:outline-none focus:border-[#CC0000] transition-colors"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-bold uppercase tracking-wider text-sm">Work Email</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      className="w-full bg-[#f5f5f0] border-2 border-black p-3 font-medium focus:outline-none focus:border-[#CC0000] transition-colors"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="firm" className="block font-bold uppercase tracking-wider text-sm">Firm / Organization</label>
                    <input 
                      type="text" 
                      id="firm"
                      required
                      className="w-full bg-[#f5f5f0] border-2 border-black p-3 font-medium focus:outline-none focus:border-[#CC0000] transition-colors"
                      value={formState.firm}
                      onChange={(e) => setFormState({...formState, firm: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block font-bold uppercase tracking-wider text-sm">Message</label>
                    <textarea 
                      id="message"
                      required
                      rows={4}
                      className="w-full bg-[#f5f5f0] border-2 border-black p-3 font-medium focus:outline-none focus:border-[#CC0000] transition-colors resize-none"
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#CC0000] text-white font-black uppercase tracking-wider py-4 border-4 border-black hover:bg-black transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px]"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
