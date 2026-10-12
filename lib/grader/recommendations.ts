/**
 * Recommendation generation for failed/warning checks.
 * Every recommendation is tied to real scan evidence and carries a CTA that
 * maps to an existing service page or the contact page.
 */

import type { Check, Recommendation, Severity } from './types';
import { CATEGORY_LABELS } from './types';

export interface RecommendationTemplate {
  title?: string;
  whyItMatters?: string;
  fix?: string;
  priority?: Severity;
  estimatedImpact?: string;
  difficulty: Recommendation['difficulty'];
  nonTechnical: boolean;
  ctaLabel: string;
  service?: string;
}

/** CTAs that point at real, existing service pages on this site. */
const SERVICE_HREF: Record<string, string> = {
  'Technical SEO': '/seo-services',
  'Structured Data': '/seo-services',
  'AI Search Optimisation': '/ai-automation',
  'Website Performance': '/web-design-development',
  'Accessibility': '/web-design-development',
  'Security': '/web-design-development',
  'Website Redesign & Development': '/web-design-development',
  'Ongoing Maintenance & Optimisation': '/web-design-development'
};

const DEFAULT_TEMPLATE: Omit<RecommendationTemplate, 'estimatedImpact'> = {
  whyItMatters: 'Fixing this improves how well your website performs for both search engines and the people who use it.',
  difficulty: 'intermediate',
  nonTechnical: false,
  ctaLabel: 'Get This Fixed'
};

function mapService(check: Check, template: RecommendationTemplate): { label: string; href: string; service?: string } {
  const categoryService: Record<string, string> = {
    seo: 'Technical SEO',
    ai: 'AI Search Optimisation',
    performance: 'Website Performance',
    accessibility: 'Accessibility',
    security: 'Security'
  };
  const serviceName = template.service ?? categoryService[check.category] ?? 'Website Redesign & Development';
  return {
    label: template.ctaLabel || DEFAULT_TEMPLATE.ctaLabel,
    href: SERVICE_HREF[serviceName] ?? '/contact',
    service: serviceName
  };
}
/** Check-id specific templates; everything falls back to a sensible default. */
const TEMPLATES: Record<string, Partial<RecommendationTemplate>> = {
  'seo-title': {
    whyItMatters: 'Titles are the first thing people and search engines see. A clear, descriptive title improves click-through and tells AI systems what the page is about.',
    estimatedImpact: 'High — directly affects how your pages are labelled and understood.',
    difficulty: 'straightforward',
    nonTechnical: true,
    ctaLabel: 'Improve My Page Titles',
    service: 'Technical SEO'
  },
  'seo-meta-description': {
    whyItMatters: 'Without a meta description, search engines may generate their own snippet and your preferred summary is missing.',
    estimatedImpact: 'Medium — better snippets can improve click-through.',
    difficulty: 'straightforward',
    nonTechnical: true,
    ctaLabel: 'Get Better Search Snippets',
    service: 'Technical SEO'
  },
  'seo-structured-data': {
    whyItMatters: 'Invalid or missing structured data means search engines cannot reliably read your entities and rich-result eligibility is lost.',
    estimatedImpact: 'Medium — valid schema unlocks richer result formats.',
    difficulty: 'advanced',
    nonTechnical: false,
    ctaLabel: 'Fix My Structured Data',
    service: 'Structured Data'
  },
  'seo-broken-links': {
    whyItMatters: 'Broken links frustrate visitors, waste crawl budget and signal poor maintenance.',
    estimatedImpact: 'Medium — removes a barrier for users and crawlers.',
    difficulty: 'intermediate',
    nonTechnical: false,
    ctaLabel: 'Fix My Broken Links',
    service: 'Technical SEO'
  },
  'seo-status': {
    whyItMatters: 'An error status means the page is not being served properly at all.',
    estimatedImpact: 'Critical — the page may be entirely unavailable.',
    difficulty: 'advanced',
    nonTechnical: false,
    ctaLabel: 'Fix My Website Error',
    service: 'Website Redesign & Development'
  },
  'perf-third-party-scripts': {
    whyItMatters: 'Excessive third-party scripts are one of the most common causes of slow, janky websites.',
    estimatedImpact: 'High — removing heavy scripts often has a noticeable effect on load time.',
    difficulty: 'advanced',
    nonTechnical: false,
    ctaLabel: 'Improve My Website Speed',
    service: 'Website Performance'
  },
  'perf-page-weight': {
    whyItMatters: 'Heavier pages take longer to load, especially on mobile connections.',
    estimatedImpact: 'Medium — reducing page weight typically improves load speed.',
    difficulty: 'intermediate',
    nonTechnical: false,
    ctaLabel: 'Speed Up My Website',
    service: 'Website Performance'
  },
  'ai-business-identity': {
    whyItMatters: 'AI answer engines can only attribute content to a business they can clearly identify.',
    estimatedImpact: 'Medium — clearer identity supports accurate AI attribution.',
    difficulty: 'intermediate',
    nonTechnical: true,
    ctaLabel: 'Make My Site AI-Friendly',
    service: 'AI Search Optimisation'
  },
  'ai-service-clarity': {
    whyItMatters: 'Thin content gives AI systems little substance to describe or recommend.',
    estimatedImpact: 'Medium — better copy makes your value clear to people and AI alike.',
    difficulty: 'intermediate',
    nonTechnical: true,
    ctaLabel: 'Improve My Website Content',
    service: 'AI Search Optimisation'
  },
  'a11y-form-labels': {
    whyItMatters: 'Unlabelled form fields make forms impossible for screen-reader users to complete correctly.',
    estimatedImpact: 'High for affected users — a legal and practical requirement.',
    difficulty: 'straightforward',
    nonTechnical: false,
    ctaLabel: 'Fix My Forms for Accessibility',
    service: 'Accessibility'
  },
  'sec-csp': {
    whyItMatters: 'A well-tuned Content Security Policy is one of the strongest defences against XSS and injection attacks.',
    estimatedImpact: 'High — hardens the site against common web attacks.',
    difficulty: 'advanced',
    nonTechnical: false,
    ctaLabel: 'Harden My Website Security',
    service: 'Security'
  }
};
export function buildRecommendations(checks: Check[], targetUrl: string): Recommendation[] {
  const recommendations: Recommendation[] = [];
  for (const check of checks) {
    if (check.status !== 'fail' && check.status !== 'warning') continue;
    const template = TEMPLATES[check.id] ?? {};
    const merged = { ...DEFAULT_TEMPLATE, ...template };
    const cta = mapService(check, merged);
    const priority: Severity = merged.priority ?? check.severity ?? (check.status === 'fail' ? 'medium' : 'low');
    recommendations.push({
      checkId: check.id,
      category: check.category,
      title: template.title ?? check.name,
      whatDetected: check.evidence[0] ?? check.explanation,
      whyItMatters: merged.whyItMatters ?? DEFAULT_TEMPLATE.whyItMatters!,
      fix: check.fix ?? 'Investigate and correct the issue using the evidence above.',
      priority,
      estimatedImpact: merged.estimatedImpact ?? 'Medium — improves the relevant signals.',
      difficulty: merged.difficulty,
      nonTechnical: merged.nonTechnical,
      cta: {
        label: cta.label,
        href: cta.href,
        service: cta.service
      }
    });
  }
  // Order by priority severity.
  const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => severityOrder[a.priority] - severityOrder[b.priority]);
  return recommendations;
}

export { CATEGORY_LABELS };


