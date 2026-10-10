'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { ScreenTab, Project, ServiceItem, AIStudioContext, PublicPageTab, BuildServiceSlug } from './types';
import { PUBLIC_PAGES } from './data/sitePages';
import { SimpleNavbar } from './components/SimpleNavbar';
import { Hero } from './components/Hero';
import { AcademySection, HomeClosingSections, HomeSections } from './components/HomeSections';
import { ProjectsSection } from './components/ProjectsSection';
import { SimpleFooter } from './components/SimpleFooter';
const FiberNetwork = dynamic(() => import('./components/FiberNetwork').then((module) => module.FiberNetwork), { ssr: false, loading: () => null });

const SpecialtyDomains = dynamic(() => import('./components/SpecialtyDomains').then((module) => module.SpecialtyDomains));
const ServicesSection = dynamic(() => import('./components/ServicesSection').then((module) => module.ServicesSection));
const SkillsMarquee = dynamic(() => import('./components/SkillsMarquee').then((module) => module.SkillsMarquee));
const TheWholePackage = dynamic(() => import('./components/TheWholePackage').then((module) => module.TheWholePackage));
const ContactSection = dynamic(() => import('./components/ContactSection').then((module) => module.ContactSection));
const ProjectModal = dynamic(() => import('./components/ProjectModal').then((module) => module.ProjectModal));
const ConsultationModal = dynamic(() => import('./components/ConsultationModal').then((module) => module.ConsultationModal));
const AiToolStudio = dynamic(() => import('./components/AiToolStudio').then((module) => module.AiToolStudio));
const EmailTemplateSandbox = dynamic(() => import('./components/EmailTemplateSandbox').then((module) => module.EmailTemplateSandbox));
const PublicPageContent = dynamic(() => import('./components/PublicPageContent').then((module) => module.PublicPageContent));
const ProjectBriefPage = dynamic(() => import('./components/ProjectBriefPage').then((module) => module.ProjectBriefPage));
const OnlineClassesPage = dynamic(() => import('./components/OnlineClassesPage').then((module) => module.OnlineClassesPage));

const VALID_TABS: ScreenTab[] = ['home', 'build', 'start', 'package', 'classes', 'projects', 'services', 'expertise', 'ai-tool', 'contact', 'email-sandbox', 'about', 'seo-services', 'local-seo', 'google-ads-management', 'social-media-marketing', 'web-design-development', 'agency-development-partner', 'app-development', 'ai-automation'];

interface AppProps {
  initialTab?: ScreenTab;
  initialService?: BuildServiceSlug;
}

/** Reads the browser URL (pathname or ?tab=) and resolves the active tab. */
function getTabFromBrowser(): ScreenTab {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/$/, '');
  if (path === '/build' || path === '/start') return path.slice(1) as ScreenTab;
  if (path === '/package') return 'package';
  if (path === '/classes') return 'classes';
  if (path === '/projects' || path === '/services' || path === '/expertise') return path.slice(1) as ScreenTab;
  if (path === '/email-sandbox') return 'email-sandbox';
  const page = Object.values(PUBLIC_PAGES).find((candidate) => path === `/${candidate.slug}`);
  if (page) return page.tab;
  const requested = new URLSearchParams(window.location.search).get('tab');
  if (requested && (VALID_TABS as string[]).includes(requested)) {
    return requested as ScreenTab;
  }
  return 'home';
}

/** Builds a shareable, refresh-safe URL for a given tab. */
function getUrlForTab(tab: ScreenTab): string {
  if (tab === 'home') return '/';
  if (tab === 'build' || tab === 'start' || tab === 'package' || tab === 'classes' || tab === 'email-sandbox') return `/${tab}`;
  if (tab === 'projects' || tab === 'services' || tab === 'expertise') return `/${tab}`;
  const page = Object.values(PUBLIC_PAGES).find((candidate) => candidate.tab === tab);
  if (page) return `/${page.slug}`;
  return `/?tab=${tab}`;
}

export default function App({ initialTab = 'home', initialService }: AppProps) {
  const [currentTab, setCurrentTab] = useState<ScreenTab>(initialTab);
  const previousTab = useRef(initialTab);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);
  const [aiContext, setAiContext] = useState<AIStudioContext | null>(null);

  // Keep the SPA tab state in sync with the URL so direct visits to
  // /package and /email-sandbox (and ?tab=... URLs) land on the right screen.
  useEffect(() => {
    setCurrentTab(getTabFromBrowser());

    const handlePopState = () => setCurrentTab(getTabFromBrowser());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (previousTab.current === currentTab) return;
    previousTab.current = currentTab;
    window.dispatchEvent(new Event('cjc:virtual-pageview'));
  }, [currentTab]);

  const handleSelectTab = (tab: ScreenTab) => {
    setCurrentTab(tab);
    window.history.replaceState(null, '', getUrlForTab(tab));
  };

  const handleSelectServiceForInquiry = (service: ServiceItem) => {
    setPreselectedService(service);
    setAiContext(null);
    setIsConsultationOpen(true);
  };

  const handleOpenConsultation = (context?: AIStudioContext) => {
    setPreselectedService(null);
    setAiContext(context ?? null);
    setIsConsultationOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationOpen(false);
    setAiContext(null);
  };

  return (
    <div className="relative isolate min-h-screen bg-[#060608] text-[#ededed] selection:bg-[#FF003C] selection:text-white flex flex-col font-sans">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#060608]">
        <FiberNetwork />
        <div className="site-fiber-shade absolute inset-0" />
      </div>

      {/* Top Navigation */}
      <SimpleNavbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Content Areas */}
      <main key={currentTab} className={`relative z-10 flex-grow ${currentTab === 'home' ? '' : 'page-enter'}`}>
        {currentTab === 'home' && (
          <>
            <Hero
              onNavigate={handleSelectTab}
            />
            <HomeSections onOpenConsultation={handleOpenConsultation} onNavigate={handleSelectTab} />
            <ProjectsSection
              onSelectProject={setSelectedProject}
              onOpenConsultation={handleOpenConsultation}
              compact
              onViewAll={() => setCurrentTab('projects')}
            />
            <HomeClosingSections onOpenConsultation={handleOpenConsultation} onNavigate={handleSelectTab} />
            <AcademySection onNavigateToClasses={() => handleSelectTab('classes')} />
          </>
        )}

        {(currentTab === 'build' || currentTab === 'start') && (
          <ProjectBriefPage key={currentTab} mode={currentTab} initialService={initialService} />
        )}

        {currentTab === 'classes' && <OnlineClassesPage />}

        {currentTab === 'package' && (
          <div className="pt-6">
            <TheWholePackage
              onNavigateToBuild={() => handleSelectTab('build')}
              onNavigateToProjects={() => setCurrentTab('projects')}
            />
            <ProjectsSection
              onSelectProject={setSelectedProject}
              onOpenConsultation={handleOpenConsultation}
            />
            <ContactSection />
          </div>
        )}

        {currentTab === 'projects' && (
          <div className="pt-6">
            <ProjectsSection
              onSelectProject={setSelectedProject}
              onOpenConsultation={handleOpenConsultation}
              showAllInitially={true}
            />
            <ContactSection />
          </div>
        )}

        {currentTab === 'services' && (
          <div className="pt-6">
            <ServicesSection
              onSelectServiceForInquiry={handleSelectServiceForInquiry}
            />
            <SpecialtyDomains
              onNavigateTab={setCurrentTab}
              onOpenConsultation={handleOpenConsultation}
            />
            <ContactSection />
          </div>
        )}

        {currentTab === 'expertise' && (
          <div className="pt-6">
            <SpecialtyDomains
              onNavigateTab={setCurrentTab}
              onOpenConsultation={handleOpenConsultation}
            />
            <SkillsMarquee />
            <ServicesSection
              onSelectServiceForInquiry={handleSelectServiceForInquiry}
            />
            <ContactSection />
          </div>
        )}

        {currentTab === 'ai-tool' && (
          <div className="pt-6">
            <AiToolStudio onOpenConsultation={handleOpenConsultation} />
            <ProjectsSection
              onSelectProject={setSelectedProject}
              onOpenConsultation={handleOpenConsultation}
            />
            <ContactSection />
          </div>
        )}

        {currentTab === 'about' && (
          <PublicPageContent
            page="about"
            onNavigateToProjects={() => handleSelectTab('projects')}
          />
        )}

        {(currentTab === 'seo-services' || currentTab === 'local-seo' || currentTab === 'google-ads-management' || currentTab === 'social-media-marketing' || currentTab === 'web-design-development' || currentTab === 'agency-development-partner' || currentTab === 'app-development' || currentTab === 'ai-automation') && (
          <PublicPageContent
            page={currentTab as Exclude<PublicPageTab, 'contact'>}
            onNavigateToProjects={() => handleSelectTab('projects')}
          />
        )}

        {currentTab === 'contact' && (
          <div className="pt-6">
            <ContactSection />
          </div>
        )}

        {currentTab === 'email-sandbox' && (
          <div className="pt-6">
            <EmailTemplateSandbox />
          </div>
        )}
      </main>

      {/* Footer */}
      <SimpleFooter
        onNavigate={setCurrentTab}
      />

      {/* Case Study Modal */}
      {selectedProject && <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNavigateToBuild={() => handleSelectTab('build')}
      />}

      {/* Consultation Modal */}
      {isConsultationOpen && <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={handleCloseConsultation}
        preselectedService={preselectedService}
        aiContext={aiContext}
      />}
    </div>
  );
}
