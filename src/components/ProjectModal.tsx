import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { getProjectImageUrl } from '../data/portfolioData';
import { X, ExternalLink, Cpu, Layers, Terminal, CheckCircle } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigateToBuild: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onNavigateToBuild }) => {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [project?.id]);

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

  const gallery = project.caseStudy?.gallery ?? project.imageUrls.map((src, index) => ({
    src,
    alt: `${project.title} preview ${index + 1}`,
    caption: `Project view ${index + 1}`,
    href: project.liveUrl ?? '#'
  }));
  const activeGalleryItem = gallery[Math.min(activeGalleryIndex, gallery.length - 1)];
  const activeGalleryImage = activeGalleryItem.src.startsWith('http')
    ? activeGalleryItem.src
    : getProjectImageUrl(activeGalleryItem.src);

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

        {gallery.length > 0 && <section className="mb-8" aria-label={`${project.title} image gallery`}>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-white/70">Project gallery</h3>
              <p className="mt-1 text-xs text-white/45">Homepage and venue pages from the live experience.</p>
            </div>
            <span className="font-mono text-[10px] text-white/45">{activeGalleryIndex + 1} / {gallery.length}</span>
          </div>
          <figure>
            <div className="group/image relative aspect-video overflow-hidden border border-white/10 bg-black/40">
              <img
                src={activeGalleryImage}
                alt={activeGalleryItem.alt}
                onError={(event) => {
                  (event.target as HTMLImageElement).src = '/assets/projects/project-preview.svg';
                }}
                className="h-full w-full object-cover"
              />
              <a href={activeGalleryItem.href} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 inline-flex min-h-9 items-center gap-2 bg-black/85 px-3 font-mono text-[9px] font-bold uppercase tracking-wider text-white transition-colors hover:text-[#FF003C]">View live page <ExternalLink className="h-3.5 w-3.5" /></a>
            </div>
            <figcaption className="mt-2 text-sm font-semibold text-white/80">{activeGalleryItem.caption}</figcaption>
          </figure>
          {gallery.length > 1 && <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {gallery.map((item, index) => {
              const thumbnailSrc = item.src.startsWith('http') ? item.src : getProjectImageUrl(item.src);
              return <button key={`${item.src}-${index}`} type="button" onClick={() => setActiveGalleryIndex(index)} aria-pressed={activeGalleryIndex === index} className={`min-w-0 border text-left transition-colors ${activeGalleryIndex === index ? 'border-[#00DFC9]' : 'border-white/10 hover:border-white/35'}`}>
                <span className="block aspect-video overflow-hidden bg-black/40"><img src={thumbnailSrc} alt="" loading="lazy" className="h-full w-full object-cover" /></span>
                <span className="block truncate px-2 py-2 text-[10px] text-white/65">{item.caption}</span>
              </button>;
            })}
          </div>}
        </section>}

        {/* Tech Stack Pills */}
        {project.techStack.length > 0 && <div className="mb-8">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white/65 mb-3 flex items-center gap-2">
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
        </div>}

        {/* Detailed Breakdown */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white/65 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Case Study
          </h4>
          {project.caseStudy ? <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <h5 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF003C]">The business</h5>
              <p className="text-sm leading-relaxed text-white/70">{project.caseStudy.business}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <h5 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF003C]">What I built</h5>
              <p className="text-sm leading-relaxed text-white/70">{project.caseStudy.built}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-5 sm:col-span-2">
              <h5 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF003C]">My role</h5>
              <p className="text-sm leading-relaxed text-white/70">{project.caseStudy.role}</p>
              {project.caseStudy.outcome && <p className="mt-4 border-t border-white/10 pt-4 text-sm font-semibold text-white">{project.caseStudy.outcome}</p>}
            </div>
            {project.caseStudy.delivery && <div className="border-t border-white/10 pt-5 sm:col-span-2">
              <h5 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">End-to-end delivery</h5>
              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {project.caseStudy.delivery.map((item) => <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-white/70"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#00DFC9]" />{item}</li>)}
              </ul>
            </div>}
          </div> : <div className="text-white/70 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-white/[0.02] p-5 rounded-2xl border border-white/5 font-sans">{project.longDescription}</div>}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-white/65">
            Have something similar in mind?
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
                onNavigateToBuild();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF003C] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,60,0.4)] hover:scale-105 transition-all"
            >
              Build something similar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
