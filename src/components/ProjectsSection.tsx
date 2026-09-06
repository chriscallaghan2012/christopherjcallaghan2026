'use client';

import React, { useState, useMemo } from 'react';
import { PROJECTS_DATA, getHotlinkImageUrl } from '../data/portfolioData';
import { Project } from '../types';
import { Search, Sparkles, Filter, ExternalLink, ArrowRight, Eye } from 'lucide-react';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  onOpenConsultation: () => void;
  showAllInitially?: boolean;
}

const CATEGORIES = [
  'All',
  'Full-Stack',
  'AI & Automation',
  'SaaS & Platform',
  'E-Commerce',
  'APIs & Integrations'
];

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  onOpenConsultation,
  showAllInitially = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="projects" className="relative w-full py-20 md:py-28 overflow-hidden bg-black/50">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Production Systems & Platforms
          </div>

          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
            <span className="text-moving-gradient">Featured Work</span>
          </h2>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Archive of custom platforms, educational portals, high-throughput APIs, and AI applications.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-black/60 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-white/10">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#FF003C] text-white shadow-[0_0_20px_rgba(255,0,60,0.4)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech or project..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF003C]/60 transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const hotlinkUrl = getHotlinkImageUrl(project.imageUrls[0]);

            return (
              <div
                key={project.id}
                className="group flex flex-col h-full rounded-3xl overflow-hidden bg-black/50 backdrop-blur-2xl border border-white/10 transition-all duration-500 hover:border-[#FF003C]/50 hover:shadow-[0_0_35px_rgba(255,0,60,0.25)] hover:-translate-y-1.5"
              >
                {/* Card Header */}
                <div className="relative z-10 p-5 pb-3">
                  <h3 className="font-black text-lg md:text-xl tracking-tight mb-1 text-white group-hover:text-[#FF003C] transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-white/45 text-xs line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Card Media Preview */}
                <div 
                  className="relative aspect-video w-full overflow-hidden bg-black/70 cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 z-10" />
                  <img
                    src={hotlinkUrl}
                    alt={project.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80`;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-white/80">
                      {project.category}
                    </span>
                  </div>

                  {/* Hover Overlay Icon */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF003C] text-white text-xs font-bold font-mono shadow-lg">
                      <Eye className="w-4 h-4" />
                      View Case Study
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 pt-3 flex flex-col justify-between flex-grow gap-4 bg-black/30 border-t border-white/5">
                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-white/40">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 font-bold">
                      ARCHIVE_#{project.id}
                    </span>
                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs font-mono font-bold text-white/70 hover:text-[#FF003C] transition-colors flex items-center gap-1 group/btn"
                    >
                      <span>About this project</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl border border-white/10 bg-black/40">
            <p className="text-white/50 text-base mb-4">No projects matched your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
