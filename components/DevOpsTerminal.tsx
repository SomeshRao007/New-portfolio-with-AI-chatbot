import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SkillCategory, Skill } from '../types';

interface CommandOutput {
  command: string;
  response: string | React.ReactNode;
}

interface DevOpsTerminalProps {
  skillCategories: SkillCategory[];
}

const neofetchNode = (
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 mt-2 text-xs sm:text-sm">
    <div className="text-blue-500 font-bold whitespace-pre hidden sm:block leading-tight">
{`   _____                       _       
  / ____|                     | |      
 | (___   ___  _ __ ___   ___ | |__    
  \\___ \\ / _ \\| '_ \` _ \\ / _ \\| '_ \\   
  ____) | (_) | | | | | |  __/| | | |  
 |_____/ \\___/|_| |_| |_|\\___||_| |_|`}
    </div>
    <div className="flex flex-col justify-end pb-1 leading-relaxed">
      <div className="text-white font-bold"><span className="text-blue-400">guest</span>@<span className="text-white">somesh-os</span></div>
      <div className="text-gray-500">-----------------</div>
      <div><span className="text-blue-400 font-bold">OS:</span> SomeshOS v2.4.1 CloudNative</div>
      <div><span className="text-blue-400 font-bold">Host:</span> AI Optimized Infrastructure</div>
      <div><span className="text-blue-400 font-bold">Uptime:</span> 99.999%</div>
      <div><span className="text-blue-400 font-bold">Packages:</span> AWS, K8s, Docker, Terraform</div>
      <div><span className="text-blue-400 font-bold">Shell:</span> bash 5.1.16</div>
      <div className="mt-2 text-gray-300 italic">Type "help" for available commands.</div>
      <div className="text-gray-300 italic">Try typing "skills" to view technical expertise.</div>
    </div>
  </div>
);

export const DevOpsTerminal: React.FC<DevOpsTerminalProps> = ({ skillCategories }) => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'neofetch',
      response: neofetchNode,
    },
  ]);
  const [input, setInput] = useState('');
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fix: Scroll only the terminal container itself, preventing the entire page from moving
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const renderSkillGrid = (skills: Skill[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 min-h-24 pb-4">
      {skills.map((skill, index) => (
        <div key={`${skill.name}-${index}`} 
          className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-lg"
        >
          {skill.icon ? (
            <img src={skill.icon} alt={skill.name} className="h-8 w-8 md:h-10 md:w-10 mb-3 object-contain" />
          ) : (
             <div className="h-8 w-8 mb-3 bg-white/30 rounded-full"></div>
          )}
          <span className="font-semibold text-xs md:text-sm text-slate-200">
            {skill.name}
          </span>
        </div>
      ))}
    </div>
  );

  const renderCategories = () => (
    <div className="mt-4 pb-4">
      <p className="text-gray-300 mb-4">Available Skill Categories (Type <span className="text-yellow-400">skills [name]</span> to filter):</p>
      <div className="flex flex-wrap gap-2">
        {skillCategories.map(cat => (
          <button 
            key={cat.name} 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleInputSubmit(`skills ${cat.name}`);
            }}
            className="px-3 py-1 bg-blue-600/30 border border-blue-400 text-blue-200 rounded-md hover:bg-blue-600/60 transition-colors text-xs z-20 relative cursor-pointer"
          >
            {cat.name.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );

  const handleInputSubmit = (cmdString: string) => {
    if (!cmdString.trim()) return;
    const rawCmd = cmdString.trim();
    const args = rawCmd.toLowerCase().split(' ');
    const mainCommand = args[0];
    let response: string | React.ReactNode = '';

    switch (mainCommand) {
      case 'help':
        response = 'Available commands:\n - whoami\n - neofetch\n - skills [category]\n - experience\n - clear\n - sudo rm -rf /';
        break;
      case 'neofetch':
        response = neofetchNode;
        break;
      case 'whoami':
        response = 'Somesh Rao Coka - Cloud Native Engineer & AI Enthusiast specializing in robust, scalable DevOps.';
        break;
      case 'skills':
        if (args.length > 1) {
          const catNameSearch = args.slice(1).join(' ');
          const category = skillCategories.find(c => c.name.toLowerCase().includes(catNameSearch));
          if (category) {
            response = renderSkillGrid(category.skills);
          } else {
            response = `Category not found. Available options: ${skillCategories.map(c => c.name.toLowerCase()).join(', ')}`;
          }
        } else {
          response = renderCategories();
        }
        break;
      case 'experience':
        response = 'Fetching logs... Experience levels are optimal. See timeline below for detailed chronologies.';
        break;
      case 'sudo':
        response = 'Permission denied. Nice try though. 😉';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        response = `bash: ${mainCommand}: command not found. Try "help".`;
    }

    setHistory((prev) => [...prev, { command: rawCmd, response }]);
    setInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInputSubmit(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent moving focus
      const cmds = ['help', 'neofetch', 'whoami', 'skills', 'experience', 'clear', 'sudo rm -rf /'];
      const match = cmds.find(c => c.startsWith(input.toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-[#0d1117] border border-gray-800 font-mono text-sm sm:text-base mb-12"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-gray-800 pointer-events-none">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="mx-auto text-gray-400 text-xs text-center flex-1 pr-12">
          guest@somesh-portfolio:~
        </div>
      </div>

      {/* Terminal Body */}
      {/* We add an onClick to the entire body to focus the text input */}
      <div 
        ref={terminalBodyRef}
        onClick={() => inputRef.current?.focus()}
        className="p-6 h-[500px] overflow-y-auto text-green-400 bg-transparent flex flex-col cursor-text scroll-smooth"
      >
        {history.map((entry, i) => (
          <div key={i} className="mb-6">
            <div className="flex items-center">
              <span className="text-blue-400 mr-2 shrink-0 font-bold">guest@somesh:~$</span>
              <span className="text-white">{entry.command}</span>
            </div>
            <div className="mt-2 text-gray-300 ml-4 whitespace-pre-wrap">
              {entry.response}
            </div>
          </div>
        ))}
        
        {/* Input Line */}
        <form onSubmit={handleFormSubmit} className="flex mt-2 items-center relative z-10">
          <span className="text-blue-400 mr-2 shrink-0 font-bold">guest@somesh:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-700" 
            placeholder="Type 'skills'..."
            spellCheck="false"
            autoComplete="off"
          />
        </form>
      </div>
    </motion.div>
  );
};
