export interface Project {
  id: number;
  title: string;
  category: 'Full-Stack' | 'AI & Automation' | 'SaaS & Platform' | 'E-Commerce' | 'APIs & Integrations';
  description: string;
  longDescription: string;
  techStack: string[];
  imageUrls: string[];
  carouselDataAiHints?: string[];
  liveUrl?: string;
  featured?: boolean;
  caseStudy?: {
    business: string;
    built: string;
    role: string;
    outcome?: string;
    delivery?: string[];
    gallery?: Array<{
      src: string;
      alt: string;
      caption: string;
      href: string;
    }>;
  };
}

export interface ServiceItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  deliverables?: string[];
  idealFor?: string;
}

export interface ProcessFlowStep {
  title: string;
  description: string;
}

export interface ProcessFlowContent {
  title: string;
  intro: string;
  steps: ProcessFlowStep[];
}

export interface SystemMapNode {
  id: string;
  title: string;
  summary: string;
  detail: string;
  examples?: string[];
  group: 'source' | 'work' | 'outcome';
}

export interface SystemMapContent {
  title: string;
  intro: string;
  nodes: SystemMapNode[];
  connections: Array<[string, string]>;
}

export interface RoleExpertise {
  title: string;
  subtitle: string;
  desc: string;
  highlight: string;
  metric?: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  desc: string;
  icon: string;
  technologies?: string[];
}

export interface SkillItem {
  name: string;
  slug: string;
  category: 'Frontend' | 'Backend' | 'Cloud & DevOps' | 'AI & Data' | 'E-Commerce';
}

export interface Testimonial {
  name: string;
  role?: string;
  company?: string;
  text: string;
  rating: number;
  avatarUrl: string;
}

export type PublicPageTab = 'about' | 'contact' | 'seo-services' | 'local-seo' | 'google-ads-management' | 'social-media-marketing' | 'web-design-development' | 'agency-development-partner' | 'app-development' | 'ai-automation';

export type ScreenTab = 'home' | 'build' | 'start' | 'package' | 'classes' | 'projects' | 'services' | 'expertise' | 'ai-tool' | 'email-sandbox' | PublicPageTab;

export interface ArchitectureBlueprint {
  title: string;
  domain: string;
  frontend: string;
  backend: string;
  database: string;
  aiEngine: string;
  devops: string;
  keyWorkflows: string[];
  latencyTarget: string;
}

export interface AIStudioContext {
  blueprint: ArchitectureBlueprint;
  prompt: string;
  model: string;
  scale: string;
}

export interface VenturePackageModule {
  id: string;
  name: string;
  category: 'setup' | 'advertising' | 'funding';
  description: string;
  deliverables: string[];
  impactMetric: string;
  defaultChecked?: boolean;
}

export interface VentureStageConfig {
  stage: 'SME & Early Startup' | 'Pre-Seed / Angel' | 'Seed / Acceleration' | 'Series A / Scale' | 'Self-Funded / Bootstrapped';
  targetRaise: string;
  timeToMarket: string;
  focus: string;
  badge?: string;
}
