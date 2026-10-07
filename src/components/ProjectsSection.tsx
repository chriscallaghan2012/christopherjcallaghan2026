'use client';

import React, { useState, useMemo } from 'react';
import { PROJECTS_DATA, getProjectImageUrl } from '../data/portfolioData';
import { Project } from '../types';
import { Search, ExternalLink, ArrowRight, Eye } from 'lucide-react';
import { ScrollWritingTitle } from './ScrollWritingTitle';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  onOpenConsultation: () => void;
  showAllInitially?: boolean;
  compact?: boolean;
  onViewAll?: () => void;
}

const CATEGORIES = [
  'All',
  'Full-Stack',
  'AI & Automation',
  'SaaS & Platform',
  'E-Commerce',
  'APIs & Integrations'
];

const PRIORITIZED_PROJECT_IDS = [17, 18, 14, 4, 5, 15, 16, 11, 6, 13];
const PROJECT_ORDER = new Map(PRIORITIZED_PROJECT_IDS.map((id, index) => [id, index]));

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  onOpenConsultation,
  showAllInitially = false,
  compact = false,
  onViewAll
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((p) => {
      if (compact && !p.featured) return false;
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    }).sort((left, right) =>
      (PROJECT_ORDER.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
      (PROJECT_ORDER.get(right.id) ?? Number.MAX_SAFE_INTEGER)
    );
  }, [selectedCategory, searchQuery, compact]);

  return (
    <section id="projects" className="relative w-full py-20 md:py-28 overflow-hidden bg-black/50">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            {compact ? 'Selected work' : 'Production Systems & Platforms'}
          </div>

          <ScrollWritingTitle text={compact ? "Things I've Built." : 'Featured Work'} accentWords={compact ? [{ word: 'Built.', color: 'orange' }] : [{ word: 'Featured', color: 'orange' }, { word: 'Work', color: 'purple' }]} className="text-4xl md:text-7xl font-black tracking-tighter text-white" />

          {!compact && <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">Archive of custom platforms, educational portals, APIs and AI applications.</p>}
        </div>

        {/* Filter Controls Bar */}
        {!compact && <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-black/60 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-white/10">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00DFC9]/60 transition-colors"
            />
          </div>
        </div>}

        {/* Projects Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${compact ? 'gap-5 lg:gap-7' : 'lg:grid-cols-3 gap-6'}`}>
          {filteredProjects.map((project) => {
            const projectImageUrl = getProjectImageUrl(project.imageUrls[0]);

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
                  <p className="text-white/65 text-xs line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  {project.caseStudy?.outcome && <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF003C]">{project.caseStudy.outcome}</p>}
                </div>

                {/* Card Media Preview */}
                <div 
                  className="relative aspect-video w-full overflow-hidden bg-black/70 cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 z-10" />
                  <img
                    src={projectImageUrl}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/projects/project-preview.svg';
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
                    {project.techStack.length > 0 ? project.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/60">{tech}</span>
                    )) : <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/65">Website / digital product</span>}
                    {project.techStack.length > 3 && <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-white/60">+{project.techStack.length - 3}</span>}
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/55 font-bold">PROJECT_#{project.id}</span>
                    <div className="flex items-center gap-4">
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`} onClick={(event) => event.stopPropagation()} className="text-white/50 transition-colors hover:text-[#FF003C]"><ExternalLink className="h-4 w-4" /></a>}
                      <button onClick={() => onSelectProject(project)} className="text-xs font-mono font-bold text-white/70 hover:text-[#FF003C] transition-colors flex items-center gap-1 group/btn">
                        <span>Case study</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {compact && onViewAll && <div className="mt-10 text-center"><button onClick={onViewAll} className="inline-flex items-center gap-2 border-b border-[#FF003C]/60 pb-2 text-xs font-black tracking-[0.16em] text-white transition-all hover:gap-4 hover:text-[#FF003C]">VIEW ALL WORK <ArrowRight className="h-4 w-4" /></button></div>}

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
