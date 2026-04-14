import React from 'react';
import { SkillCategory } from '../types';
import { DevOpsTerminal } from './DevOpsTerminal';

type SkillsProps = {
  data: SkillCategory[];
};

const Skills: React.FC<SkillsProps> = ({ data }) => {
  return (
    <section className="py-20 md:py-24 bg-transparent rounded-2xl relative z-10 w-full pointer-events-auto">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">&gt; ./execute --tech-stack</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">Technical Interface</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Type 'skills' in the terminal below to interface with the core logic.
            </p>
        </div>

        {/* --- Unified Terminal Interface --- */}
        <DevOpsTerminal skillCategories={data} />

      </div>
    </section>
  );
};

export default Skills;