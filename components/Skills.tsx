import React, { useState } from 'react';
import { SkillCategory } from '../types';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { 
  Cloud, 
  Container, 
  Activity, 
  Brain, 
  Globe, 
  Database, 
  Code 
} from 'lucide-react';

type SkillsProps = {
  data: SkillCategory[];
};

const Skills: React.FC<SkillsProps> = ({ data }) => {
  // Initialize with the first category name if data exists
  const [activeCategory, setActiveCategory] = useState<string | null>(data.length > 0 ? data[0].name : null);

  const filteredSkills = data.find(cat => cat.name === activeCategory)?.skills || [];

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Cloud Platform': return <Cloud className="w-full h-full text-neutral-600 dark:text-neutral-300" />;
      case 'DevOps': return <Container className="w-full h-full text-neutral-600 dark:text-neutral-300" />;
      case 'Monitoring': return <Activity className="w-full h-full text-neutral-600 dark:text-neutral-300" />;
      case 'AI/ML': return <Brain className="w-full h-full text-neutral-600 dark:text-neutral-300" />;
      case 'Web Development': return <Globe className="w-full h-full text-neutral-600 dark:text-neutral-300" />;
      case 'Programming & Databases': return <Database className="w-full h-full text-neutral-600 dark:text-neutral-300" />;
      default: return <Code className="w-full h-full text-neutral-600 dark:text-neutral-300" />;
    }
  };

  return (
    <section className="py-20 md:py-24 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Skills</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">Technical Expertise</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Select a category below to filter skills
            </p>
        </div>

        {/* --- DOCK START --- */}
        <div className="relative h-32 w-full flex items-center justify-center mb-8">
          <Dock 
            magnification={70} 
            distance={100} 
            className='gap-8 px-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl'
          >
            {data.map((category) => (
              <DockItem 
                key={category.name} 
                className="cursor-pointer bg-transparent border-none shadow-none hover:bg-transparent"
                onClick={() => setActiveCategory(category.name)}
              >
                <DockLabel className="text-lg text-slate-900 dark:text-white">
                  {category.name}
                </DockLabel>
                
                <DockIcon>
                    {getCategoryIcon(category.name)}
                </DockIcon>
              </DockItem>
            ))}
          </Dock>
        </div>
        {/* --- DOCK END --- */}

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 min-h-[300px] content-start">
          {filteredSkills.map((skill, index) => (
            <div key={`${skill.name}-${index}`} 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center hover:shadow-xl dark:hover:shadow-slate-700 hover:-translate-y-1 transition-all duration-300"
            >
              {skill.icon ? (
                <img
                  src={skill.icon}
                  alt={`${skill.name} icon`}
                  loading="lazy"
                  className="h-10 w-10 md:h-12 md:w-12 mb-4 object-contain"
                />
              ) : (
                <div className="h-10 w-10 md:h-12 md:w-12 mb-4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              )}
              <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-200">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;