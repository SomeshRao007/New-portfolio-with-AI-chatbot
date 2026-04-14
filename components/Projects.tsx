import React from 'react';
import type { Project } from '../types';
import CoverFlowCarousel, { GalleryItem } from './ui/CoverFlowCarousel';

type ProjectsProps = {
  data: Project[];
};

const Projects: React.FC<ProjectsProps> = ({ data }) => {
  const carouselItems: GalleryItem[] = data.map((project, index) => ({
    id: `project-${index}`,
    title: project.title,
    summary: project.description,
    url: project.githubUrl || '#', 
    image: project.imageUrl || '', 
  }));

  return (
    <CoverFlowCarousel 
      heading="My Projects" 
      items={carouselItems} 
    />
  );
};

export default Projects;