import React, { useState, useEffect } from 'react';
import { ScreenTab, Project, ServiceItem, AIStudioContext } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhoIAm } from './components/WhoIAm';
import { SpecialtyDomains } from './components/SpecialtyDomains';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsMarquee } from './components/SkillsMarquee';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SignalReception } from './components/SignalReception';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ConsultationModal } from './components/ConsultationModal';
import { AiToolStudio } from './components/AiToolStudio';
import { TheWholePackage } from './components/TheWholePackage';
import { EmailTemplateSandbox } from './components/EmailTemplateSandbox';

const VALID_TABS: ScreenTab[] = ['home', 'package', 'projects', 'services', 'expertise', 'ai-tool', 'contact', 'email-sandbox'];

/** Reads the browser URL (pathname or ?tab=) and resolves the active tab. */
function getTabFromBrowser(): ScreenTab {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname;
  if (path === '/package') return 'package';
  if (path === '/email-sandbox') return 'email-sandbox';
  const requested = new URLSearchParams(window.location.search).get('tab');
  if (requested && (VALID_TABS as string[]).includes(requested)) {
    return requested as ScreenTab;
  }
  return 'home';
}

/** Builds a shareable, refresh-safe URL for a given tab. */
function getUrlForTab(tab: ScreenTab): string {
  if (tab === 'home') return '/';
  if (tab === 'package' || tab === 'email-sandbox') return `/${tab}`;
  return `/?tab=${tab}`;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
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
    <div className="min-h-screen bg-[#060608] text-[#ededed] selection:bg-[#FF003C] selection:text-white flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Main Content Areas */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <>
            <Hero
              onNavigate={setCurrentTab}
              onOpenConsultation={handleOpenConsultation}
            />
            <TheWholePackage
              onOpenConsultation={handleOpenConsultation}
              onNavigateToProjects={() => setCurrentTab('projects')}
            />
            <WhoIAm />
            <SpecialtyDomains
              onNavigateTab={setCurrentTab}
              onOpenConsultation={handleOpenConsultation}
            />
            <ServicesSection
              onSelectServiceForInquiry={handleSelectServiceForInquiry}
            />
            <ProjectsSection
              onSelectProject={setSelectedProject}
              onOpenConsultation={handleOpenConsultation}
            />
            <SkillsMarquee />
            <ExperienceTimeline />
            <SignalReception />
            <ContactSection />
          </>
        )}

        {currentTab === 'package' && (
          <div className="pt-6">
            <TheWholePackage
              onOpenConsultation={handleOpenConsultation}
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
            <SkillsMarquee />
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

        {currentTab === 'contact' && (
          <div className="pt-6">
            <ContactSection />
            <SignalReception />
          </div>
        )}

        {currentTab === 'email-sandbox' && (
          <div className="pt-6">
            <EmailTemplateSandbox />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentTab}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={handleCloseConsultation}
        preselectedService={preselectedService}
        aiContext={aiContext}
      />
    </div>
  );
}
