import React, { useState } from 'react';
import { INITIAL_DATA } from '@/constants'; 
import { motion } from 'framer-motion';

type ContactProps = {
  formspreeEndpoint: string;
};

// Map social links from constants to the UI format
const mappedSocialLinks = INITIAL_DATA.personalInfo.socialLinks.map((link, idx) => ({
  id: String(idx),
  name: link.name,
  iconSrc: link.icon, 
  href: link.url
}));

const Contact: React.FC<ContactProps> = ({ formspreeEndpoint }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    projectType: [] as string[],
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type: string) => {
    if (status === 'submitting' || status === 'success') return;
    setFormData((prev) => {
      const currentTypes = prev.projectType;
      if (!currentTypes.includes(type)) {
        return { ...prev, projectType: [...currentTypes, type] };
      } else {
        return { ...prev, projectType: currentTypes.filter((t) => t !== type) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting' || status === 'success') return;

    // Basic validation
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('submitting');

    try {
      const sanitizedData = {
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        projectType: formData.projectType,
      };

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: JSON.stringify(sanitizedData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setStatus('success');
        // Do not reset right away so they can see their code, just keep it disabled
      } else {
        throw new Error("Response was not ok");
      }
    } catch (error) {
      console.error("Contact form submission failed", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const projectTypeOptions = [
    'Odoo Automation', 'DevOps Automation', 'CI/CD Pipelines',
    'Website', 'Web App', 'AI Automation','E-Commerce payments',
    'Cloud Strategy & Consulting', 'Other'
  ];

  return (
    <section className="relative min-h-screen w-full bg-transparent flex flex-col items-center py-20 overflow-hidden z-10 pointer-events-auto">

      <div className="container mx-auto px-4 relative z-10 w-full max-w-5xl">
        {/* Header section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
            <div className="max-w-2xl">
              <p className="text-sm text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase mb-2">&gt; /ROOT/CONTACT</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 drop-shadow-lg leading-tight mb-4">
                Initiate Handshake.
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-400 font-mono">
                $ echo "Let's build something amazing together." &gt; /dev/tcp/someshos/443
              </p>
            </div>
            
            {/* Socials floating on right */}
            <div className="flex items-center space-x-4 mt-8 md:mt-0">
               {mappedSocialLinks.map((link) => (
                 <a 
                   key={link.id} 
                   href={link.href} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="w-12 h-12 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center hover:bg-blue-600 hover:border-blue-400 transition-all shadow-lg group"
                 >
                   <img src={link.iconSrc} alt={link.name} className="h-5 w-5 brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                 </a>
               ))}
            </div>
        </div>

        {/* Bash Terminal IDE Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full bg-[#0d1117] rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm sm:text-base relative"
        >
          {/* Mac/Linux terminal top bar */}
          <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-gray-800">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
            </div>
            <div className="mx-auto text-slate-400 text-xs text-center flex-1 pr-12 font-semibold">
              ~/scripts/send_handshake.sh
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-2 text-slate-300 overflow-x-auto relative">
            
            {/* Overlay if success */}
            {status === 'success' && (
              <div className="absolute inset-0 z-20 bg-[#0d1117]/80 backdrop-blur-sm flex flex-col items-center justify-center">
                 <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mb-4">
                      <span className="text-green-500 font-bold text-2xl">✓</span>
                    </div>
                    <p className="text-green-400 font-bold text-lg">PACKET_DELIVERED [200 OK]</p>
                    <p className="text-slate-400 text-sm mt-2">I have received your message.</p>
                 </motion.div>
              </div>
            )}

            {/* Line numbers and code execution */}
            <div className="flex items-center group">
              <span className="text-slate-600 w-6 text-right select-none mr-4">1</span>
              <span className="text-slate-500 italic">#!/bin/bash</span>
            </div>
            <div className="flex items-center">
              <span className="text-slate-600 w-6 text-right select-none mr-4">2</span>
              <span className="text-slate-500 italic"># Configure payload variables to establish connection</span>
            </div>
            <div className="flex items-center">
              <span className="text-slate-600 w-6 text-right select-none mr-4">3</span>
            </div>
            
            {/* NAME INPUT */}
            <div className="flex items-center h-8 group focus-within:bg-white/[0.02] rounded px-1 -mx-1">
              <span className="text-slate-600 w-6 text-right select-none mr-4 opacity-50 group-hover:opacity-100 transition-opacity">4</span>
              <span className="text-pink-400 font-bold">export</span>
              <span className="text-blue-300 ml-2">NAME</span>
              <span className="text-white">=</span>
              <span className="text-green-400">"</span>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-transparent border-none outline-none text-green-400 placeholder:text-green-400/30 flex-1 min-w-[200px]"
                disabled={status !== 'idle' && status !== 'error'}
                required
                spellCheck={false}
              />
              <span className="text-green-400">"</span>
            </div>

            {/* EMAIL INPUT */}
            <div className="flex items-center h-8 group focus-within:bg-white/[0.02] rounded px-1 -mx-1">
              <span className="text-slate-600 w-6 text-right select-none mr-4 opacity-50 group-hover:opacity-100 transition-opacity">5</span>
              <span className="text-pink-400 font-bold">export</span>
              <span className="text-blue-300 ml-2">EMAIL</span>
              <span className="text-white">=</span>
              <span className="text-green-400">"</span>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="bg-transparent border-none outline-none text-green-400 placeholder:text-green-400/30 flex-1 min-w-[200px]"
                disabled={status !== 'idle' && status !== 'error'}
                required
                spellCheck={false}
              />
              <span className="text-green-400">"</span>
            </div>

            <div className="flex items-center">
               <span className="text-slate-600 w-6 text-right select-none mr-4">6</span>
            </div>

            {/* FLAGS (CHECKBOXES) */}
            <div className="flex items-center">
               <span className="text-slate-600 w-6 text-right select-none mr-4">7</span>
               <span className="text-blue-300">REQUEST_FLAGS</span>
               <span className="text-white">=(</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 my-1">
              {projectTypeOptions.map((opt, i) => {
                const isSelected = formData.projectType.includes(opt);
                const flagStr = `--${opt.toLowerCase().replace(/ /g, '-')}`;
                return (
                  <div key={opt} className="flex pl-12 items-center cursor-pointer group/flag h-8" onClick={() => handleCheckboxChange(opt)}>
                    <span className="hidden">8</span> {/* Real line numbers handled differently here for layout, omitted visually for array fields to preserve cleanness */}
                    <span className="text-slate-600 w-6 select-none mr-4 opacity-0"></span>
                    <span className={`transition-colors flex-1 ${isSelected ? 'text-yellow-300' : 'text-slate-500 group-hover/flag:text-slate-400'}`}>
                      {isSelected ? `"${flagStr}"` : `# "${flagStr}"`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center">
               <span className="text-slate-600 w-6 text-right select-none mr-4">17</span>
               <span className="text-white">)</span>
            </div>

            <div className="flex items-center">
               <span className="text-slate-600 w-6 text-right select-none mr-4">18</span>
            </div>

            {/* MULTI-LINE MESSAGE INPUT */}
            <div className="flex items-start group focus-within:bg-white/[0.02] rounded px-1 -mx-1 py-1">
               <span className="text-slate-600 w-6 text-right select-none mr-4 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">19</span>
               <span className="text-pink-400 font-bold mt-1">cat</span>
               <span className="text-white ml-2 mt-1">&lt;&lt; 'EOF' &gt;</span>
               <span className="text-blue-300 ml-2 mt-1">payload.txt</span>
            </div>
            <div className="flex items-start group focus-within:bg-white/[0.02] rounded px-1 -mx-1 py-1">
               <span className="text-slate-600 w-6 text-right select-none mr-4 opacity-0">20</span>
               <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="I am looking to build a highly scalable infrastructure..."
                  className="bg-transparent border-none outline-none text-slate-300 placeholder:text-slate-600 w-full min-h-[100px] resize-y"
                  disabled={status !== 'idle' && status !== 'error'}
                  required
                  spellCheck={false}
               />
            </div>
            <div className="flex items-center mt-1">
               <span className="text-slate-600 w-6 text-right select-none mr-4">21</span>
               <span className="text-white font-bold">EOF</span>
            </div>

            <div className="flex items-center">
               <span className="text-slate-600 w-6 text-right select-none mr-4">22</span>
            </div>

            {/* HONEYPOT */}
            <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            {/* SUBMIT BUTTON / EXECUTION INDICATOR */}
            <div className="flex items-center relative mt-4 pt-4 border-t border-slate-800">
               <span className="text-slate-600 w-6 text-right select-none mr-4">23</span>
               {(status === 'idle' || status === 'error') ? (
                  <button type="submit" className="flex items-center group cursor-pointer w-full text-left bg-transparent border-none outline-none">
                     <span className="text-pink-400 font-bold">./send</span>
                     <span className="text-slate-300 mx-2">--dispatch</span>
                     <span className="text-white transition-colors group-hover:text-green-400">
                       $NAME $EMAIL $REQUEST_FLAGS $(cat payload.txt)
                     </span>
                     <span className="ml-auto flex items-center justify-center border border-slate-600 px-3 py-1 rounded text-xs text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-all group-hover:border-blue-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        [EXECUTE]
                     </span>
                  </button>
               ) : status === 'submitting' ? (
                  <div className="flex items-center text-yellow-400 animate-pulse w-full">
                     <span className="mr-2">[*] Payload compiling...</span>
                  </div>
               ) : null}
            </div>
            
            {status === 'error' && (
              <div className="flex items-center mt-2">
                 <span className="text-slate-600 w-6 text-right select-none mr-4">24</span>
                 <span className="text-red-500 font-bold">bash: Error establishing socket. Please check network or payload variables.</span>
              </div>
            )}

          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;