import React, { useState } from 'react';
import { ScreenTab, Project, ServiceItem } from './types';
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);

  const handleSelectServiceForInquiry = (service: ServiceItem) => {
    setPreselectedService(service);
    setIsConsultationOpen(true);
  };

  const handleOpenConsultation = () => {
    setPreselectedService(null);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#ededed] selection:bg-[#FF003C] selection:text-white flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
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
        onClose={() => setIsConsultationOpen(false)}
        preselectedService={preselectedService}
      />
    </div>
  );
}
