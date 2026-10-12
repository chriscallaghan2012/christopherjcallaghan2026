import { BriefcaseBusiness, FileText, Gauge, Hammer, Search, type LucideIcon } from 'lucide-react';
import type { ScreenTab } from '../types';

export interface ToolCardData {
  slug: string;
  href: string;
  tab: ScreenTab;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  status: 'live' | 'soon';
  /** What the tool actually checks/does (accurate only). */
  capabilities?: string[];
  accent: string;
  eyebrow: string;
}

export const TOOLS: ToolCardData[] = [
  {
    slug: 'website-grader',
    href: '/tools/website-grader',
    tab: 'website-grader',
    name: 'Website Grader',
    tagline: 'Free SEO, AI search, performance, accessibility & security audit',
    description: 'Enter any public website and get a scored report covering technical SEO, AI search readiness, performance signals, accessibility and security — with prioritised fixes you can actually act on.',
    icon: Gauge,
    status: 'live',
    capabilities: ['Technical & on-page SEO', 'AI search readiness', 'Performance signals', 'Accessibility', 'Security headers'],
    accent: 'text-[#FF5575] border-[#FF003C]/40 bg-[#FF003C]/10',
    eyebrow: 'FREE TOOL'
  },
  {
    slug: 'llms-txt',
    href: '/tools/llms-txt',
    tab: 'llms-builder',
    name: 'llms.txt Builder',
    tagline: 'Create a clear guide to your site for AI systems',
    description: 'Organise your important pages, add accurate descriptions and guidance, then copy or download a ready-to-review llms.txt file.',
    icon: FileText,
    status: 'live',
    capabilities: ['Live Markdown preview', 'Organised page links', 'Copy and download'],
    accent: 'text-[#FF5575] border-[#FF003C]/40 bg-[#FF003C]/10',
    eyebrow: 'FREE TOOL'
  },
  {
    slug: 'serp-preview',
    href: '/tools/serp-preview',
    tab: 'serp-preview',
    name: 'SERP Preview Tool',
    tagline: 'Scan your page SEO and preview its search snippet',
    description: 'Enter a public page to extract its keywords, check Google positions when ranking data is connected, and preview its search snippet on desktop or mobile.',
    icon: Search,
    status: 'live',
    capabilities: ['Page-derived keyword suggestions', 'Google ranking table when configured', 'Animated desktop and mobile preview'],
    accent: 'text-[#FF5575] border-[#FF003C]/40 bg-[#FF003C]/10',
    eyebrow: 'FREE SEO TOOL'
  },
  {
    slug: 'business-launch-checklist',
    href: '/tools/business-launch-checklist',
    tab: 'business-launch-checklist',
    name: 'Business Launch Checklist',
    tagline: 'A practical next-step plan, without business jargon',
    description: 'Answer a few simple questions to get a checklist tailored to your stage, offer and how customers will buy. Save progress on your device and download the plan.',
    icon: BriefcaseBusiness,
    status: 'live',
    capabilities: ['Starting or relaunching', 'Personalised next steps', 'Saved progress'],
    accent: 'text-[#FF5575] border-[#FF003C]/40 bg-[#FF003C]/10',
    eyebrow: 'FREE TOOL'
  }
];

export const FUTURE_TOOLS: { name: string; description: string; icon: LucideIcon; accent: string }[] = [
  {
    name: 'More free tools in development',
    description: 'New free tools are being built — SEO, AI search and website improvement utilities. This directory grows over time.',
    icon: Hammer,
    accent: 'text-white/40 border-white/10 bg-white/[0.03]'
  }
];
