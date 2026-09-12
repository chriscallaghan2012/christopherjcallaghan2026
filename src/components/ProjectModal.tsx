import React, { useEffect } from 'react';
import { Project } from '../types';
import { getHotlinkImageUrl } from '../data/portfolioData';
import { X, ExternalLink, Cpu, Layers, Terminal, CheckCircle } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenConsultation }) => {
  // Lock page scroll + close on Escape while the modal is open.
  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const imageUrl = getHotlinkImageUrl(project.imageUrls[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0a0a0e] p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 max-h-[90vh] overflow-y-auto overscroll-contain text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6 pr-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF003C] text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
            Archive_Index #{project.id} • {project.category}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {project.title}
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Preview Image */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 mb-8 bg-black/40">
          <img
            src={imageUrl}
            alt={project.title}
            onError={(e) => {
              // Graceful fallback to dark tech placeholder
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80`;
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/70">
            <span>Client Deployment</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Production Verified
            </span>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="mb-8">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#FF003C]" />
            Technology Architecture
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-mono text-xs font-bold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Engineering Case Study
          </h4>
          <div className="text-white/70 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-white/[0.02] p-5 rounded-2xl border border-white/5 font-sans">
            {project.longDescription}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-white/40">
            Interested in an architecture like this?
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 text-xs font-mono uppercase font-bold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF003C] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,60,0.4)] hover:scale-105 transition-all"
            >
              Discuss Similar Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
