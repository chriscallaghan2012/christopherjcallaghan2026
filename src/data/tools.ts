import { Gauge, Hammer, type LucideIcon } from 'lucide-react';
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
