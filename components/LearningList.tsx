import React from 'react';
import type { LearningItem } from '../types';
import { motion } from 'framer-motion';

type LearningListProps = {
  data: LearningItem[];
};

const HtopBar: React.FC<{ label: string; percentage: number; colorClass: string }> = ({ label, percentage, colorClass }) => (
  <div className="flex items-center text-xs sm:text-sm font-mono mb-1">
    <span className="w-12 text-slate-400">{label}</span>
    <span className="w-10 text-slate-500 mr-2">[{percentage.toFixed(1)}%]</span>
    <div className="flex-1 h-3 bg-slate-800 flex">
      <div className={`h-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

const animateProcessDelay = (index: number) => ({
  initial: { opacity: 0, x: -10 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 0.3, delay: index * 0.1 }
});

const LearningList: React.FC<LearningListProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-transparent relative z-10 pointer-events-auto">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm text-blue-500 font-bold tracking-widest uppercase mb-2">&gt; SYSTEM_PROCESSES</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 drop-shadow-lg leading-tight">
            Active Research
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 font-mono">
            Tracking currently running learning threads...
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full bg-[#0d1117] rounded-xl border border-slate-700 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm"
        >
          {/* htop Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 p-4 border-b border-slate-800 bg-[#161b22]">
             <div>
                <HtopBar label="CPU1" percentage={87.3} colorClass="bg-green-500/80 border-r border-green-400" />
                <HtopBar label="CPU2" percentage={45.1} colorClass="bg-green-500/60 border-r border-green-400" />
                <HtopBar label="Mem" percentage={92.8} colorClass="bg-blue-500/80 border-r border-blue-400" />
             </div>
             <div className="mt-2 md:mt-0 flex flex-col justify-center text-slate-400">
                <div><span className="text-slate-300 font-bold">Tasks:</span> {data.length} running, 153 sleeping</div>
                <div><span className="text-slate-300 font-bold">Load average:</span> 4.12 3.86 3.99</div>
                <div><span className="text-slate-300 font-bold">Uptime:</span> 14 days, 06:12:45</div>
             </div>
          </div>

          {/* Process Table Header */}
          <div className="flex items-center px-4 py-2 bg-green-900/40 text-green-400 font-bold border-b border-slate-800 whitespace-nowrap overflow-x-auto">
             <div className="w-12 sm:w-16 shrink-0">PID</div>
             <div className="w-16 sm:w-20 shrink-0">USER</div>
             <div className="w-16 sm:w-24 shrink-0">STATUS</div>
             <div className="w-12 sm:w-16 shrink-0">%CPU</div>
             <div className="flex-1 min-w-[300px]">COMMAND</div>
          </div>

          {/* Process List */}
          <div className="p-2 sm:p-4 min-h-[300px] overflow-x-auto">
             {data.map((item, index) => {
               // Generate deterministic but random-looking PID and CPU based on index
               const pid = 1000 + (index * 137) % 8000;
               const cpu = (15 + (index * 47) % 60).toFixed(1);

               return (
                 <motion.div 
                   key={item.title}
                   {...animateProcessDelay(index)}
                   className="flex items-start px-2 py-2 hover:bg-slate-800/50 rounded transition-colors group whitespace-nowrap sm:whitespace-normal"
                 >
                    <div className="w-12 sm:w-16 shrink-0 text-slate-500 group-hover:text-slate-300 pt-1">{pid}</div>
                    <div className="w-16 sm:w-20 shrink-0 text-blue-400 pt-1">root</div>
                    <div className="w-16 sm:w-24 shrink-0 text-green-400 font-bold flex items-center pt-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      RUN
                    </div>
                    <div className="w-12 sm:w-16 shrink-0 text-slate-400 pt-1">{cpu}</div>
                    
                    <div className="flex-1 min-w-[300px]">
                       <div className="text-white font-bold inline-block mr-2">/usr/bin/learn</div>
                       <span className="text-yellow-300 mr-2">--target</span>
                       <span className="text-pink-400 font-bold mr-2">"{item.title}"</span>
                       
                       {/* Description wraps below logically */}
                       <div className="text-slate-400 mt-1 pl-4 sm:pl-0 sm:border-l-2 sm:border-slate-700 sm:ml-4 sm:pl-3 w-full whitespace-normal">
                          # {item.description}
                       </div>
                    </div>
                 </motion.div>
               );
             })}
          </div>

          {/* htop Footer */}
          <div className="flex items-center gap-4 px-4 py-2 bg-[#161b22] border-t border-slate-800 text-slate-500 overflow-x-auto whitespace-nowrap">
             <span><strong className="text-slate-400 hover:text-white cursor-pointer">F1</strong>Help</span>
             <span><strong className="text-slate-400 hover:text-white cursor-pointer">F2</strong>Setup</span>
             <span><strong className="text-slate-400 hover:text-white cursor-pointer">F3</strong>Search</span>
             <span><strong className="text-slate-400 hover:text-white cursor-pointer">F9</strong>Kill</span>
             <span><strong className="text-slate-400 hover:text-white cursor-pointer">F10</strong>Quit</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningList;