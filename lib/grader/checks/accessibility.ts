/**
 * Automated accessibility checks (HTML-level signals).
 * These checks do NOT establish full WCAG conformance — they flag the
 * obvious, machine-detectable issues an automated scan can find.
 */

import type { Check } from '../types';
import type { ScanContext } from '../context';
import { makeCategory } from '../context';

const DOCS = {
  wcag: { label: 'W3C: WCAG 2.2', url: 'https://www.w3.org/WAI/WCAG22/quickref/' },
  axe: { label: 'axe-core (deque)', url: 'https://github.com/dequelabs/axe-core' }
};

function check(input: Omit<Check, 'category'>): Check {
  return { ...input, category: 'accessibility' };
}

export function runAccessibilityChecks(ctx: ScanContext): Check[] {
  const checks: Check[] = [];
  const facts = ctx.pageFacts;

  if (!facts) {
    checks.push(check({
      id: 'a11y-unavailable', name: 'Accessibility checks',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['No page content available.'],
      explanation: 'Accessibility signals could not be measured because the page could not be fetched.'
    }));
    checks.push(check({
      id: 'a11y-conformance-note', name: 'Automated check scope',
      status: 'info', measured: 'not_applicable', points: 0,
      evidence: ['Automated scan.'],
      explanation: 'Automated checks cannot establish full WCAG conformance. Real accessibility requires manual and assistive-technology testing.'
    }));
    return makeCategory('accessibility', checks);
  }

  // ---- Image alt (accessibility view) ----
  const missingAlt = facts.images.filter((img) => !img.hasAlt);
  if (facts.images.length === 0) {
    checks.push(check({
      id: 'a11y-image-alt', name: 'Images have text alternatives',
      status: 'info', measured: 'measured', points: 6,
      evidence: ['No images detected.'],
      explanation: 'There were no images to evaluate.'
    }));
  } else if (missingAlt.length === 0) {
    checks.push(check({
      id: 'a11y-image-alt', name: 'Images have text alternatives',
      status: 'pass', measured: 'measured', points: 6,
      evidence: ['All images have an alt attribute.'],
      explanation: 'Every image carries an alt attribute. Informative images need meaningful alt text; decorative images should use empty alt="" — an automated scan cannot judge the wording quality.',
      refs: ['seo-img-alt']
    }));
  } else {
    checks.push(check({
      id: 'a11y-image-alt', name: 'Images have text alternatives',
      status: 'fail', severity: 'high', measured: 'measured', points: 6,
      evidence: [`${missingAlt.length} of ${facts.images.length} image(s) are missing the alt attribute.`],
      explanation: 'Images without any alt attribute provide no description to screen readers.',
      fix: 'Add alt text to informative images and alt="" to decorative ones.',
      refs: ['seo-img-alt']
    }));
  }

  // ---- Form labels ----
  if (!facts.forms) {
    checks.push(check({
      id: 'a11y-form-labels', name: 'Form fields have accessible labels',
      status: 'info', measured: 'measured', points: 7,
      evidence: ['No form fields detected.'],
      explanation: 'There were no forms to evaluate.'
    }));
  } else if (facts.forms.unlabeledInputs === 0) {
    checks.push(check({
      id: 'a11y-form-labels', name: 'Form fields have accessible labels',
      status: 'pass', measured: 'measured', points: 7,
      evidence: [`${facts.forms.inputCount} form field(s) have accessible labels (label, aria-label, aria-labelledby, or title).`],
      explanation: 'Form fields have accessible names.'
    }));
  } else {
    checks.push(check({
      id: 'a11y-form-labels', name: 'Form fields have accessible labels',
      status: 'fail', severity: 'high', measured: 'measured', points: 7,
      evidence: [`${facts.forms.unlabeledInputs} of ${facts.forms.inputCount} form field(s) have no accessible label.`],
      explanation: 'Unlabelled form fields are hard or impossible for screen-reader users to complete correctly.',
      fix: 'Associate a <label> with each field, or use aria-label/aria-labelledby.'
    }));
  }

  // ---- Heading structure ----
  if (facts.h1Count === 0) {
    checks.push(check({
      id: 'a11y-heading-structure', name: 'Page has a clear heading outline',
      status: 'warning', severity: 'medium', measured: 'measured', points: 5,
      evidence: ['No H1 heading found.'],
      explanation: 'Without an H1, screen-reader users get a weaker sense of the page structure.',
      fix: 'Add a single H1 that describes the page.',
      refs: ['seo-h1']
    }));
  } else if (facts.h1Count > 1) {
    checks.push(check({
      id: 'a11y-heading-structure', name: 'Page has a clear heading outline',
      status: 'warning', severity: 'low', measured: 'measured', points: 5,
      evidence: [`${facts.h1Count} H1 headings found.`],
      explanation: 'Multiple H1 headings can confuse the document outline for assistive technology.',
      fix: 'Use one H1 and structure the rest as H2/H3.',
      refs: ['seo-h1']
    }));
  } else {
    checks.push(check({
      id: 'a11y-heading-structure', name: 'Page has a clear heading outline',
      status: 'pass', measured: 'measured', points: 5,
      evidence: ['Exactly one H1 heading found.'],
      explanation: 'The page has a single H1.'
    }));
  }
  // ---- Document language ----
  if (!facts.lang) {
    checks.push(check({
      id: 'a11y-document-lang', name: 'Document language is set',
      status: 'fail', severity: 'high', measured: 'measured', points: 4,
      evidence: ['No lang attribute on <html>.'],
      explanation: 'Without a language declaration, screen readers and translation tools may mis-handle the page.',
      fix: 'Add lang="en" (or the correct language) to the <html> element.',
      refs: ['seo-lang']
    }));
  } else {
    checks.push(check({
      id: 'a11y-document-lang', name: 'Document language is set',
      status: 'pass', measured: 'measured', points: 4,
      evidence: [`lang="${facts.lang}"`],
      explanation: 'The document declares its language.'
    }));
  }

  // ---- Landmarks ----
  const landmarks = [];
  if (facts.hasMain) landmarks.push('main');
  if (facts.hasNav) landmarks.push('nav');
  if (facts.hasHeader) landmarks.push('header');
  if (facts.hasFooter) landmarks.push('footer');
  if (landmarks.length >= 2) {
    checks.push(check({
      id: 'a11y-landmarks', name: 'Page uses semantic landmarks',
      status: 'pass', measured: 'measured', points: 5,
      evidence: [`Landmarks found: ${landmarks.join(', ')}`],
      explanation: 'Semantic landmark elements help assistive technology users navigate the page.'
    }));
  } else {
    checks.push(check({
      id: 'a11y-landmarks', name: 'Page uses semantic landmarks',
      status: 'warning', severity: 'medium', measured: 'measured', points: 5,
      evidence: [`Landmarks found: ${landmarks.join(', ') || 'none'}`],
      explanation: 'Few or no semantic landmarks were found. Landmarks such as <main>, <nav>, <header> and <footer> aid navigation for assistive technology.',
      fix: 'Use semantic landmark elements instead of generic <div> containers.'
    }));
  }

  // ---- Link naming ----
  const unnamedLinks = facts.links.filter((l) => !l.hasText).length;
  if (unnamedLinks === 0) {
    checks.push(check({
      id: 'a11y-link-naming', name: 'Links have descriptive text',
      status: 'pass', measured: 'measured', points: 4,
      evidence: ['All links have accessible text.'],
      explanation: 'Links are named descriptively.'
    }));
  } else {
    checks.push(check({
      id: 'a11y-link-naming', name: 'Links have descriptive text',
      status: 'warning', severity: 'medium', measured: 'measured', points: 4,
      evidence: [`${unnamedLinks} of ${facts.links.length} link(s) have empty or generic text ("click here").`],
      explanation: 'Links with empty or generic text give screen-reader users no idea where they lead.',
      fix: 'Write descriptive link text that says where the link goes (avoid "click here").'
    }));
  }

  // ---- Button naming ----
  if (facts.buttons.total === 0) {
    checks.push(check({
      id: 'a11y-button-naming', name: 'Buttons have accessible names',
      status: 'info', measured: 'measured', points: 4,
      evidence: ['No buttons detected.'],
      explanation: 'There were no buttons to evaluate.'
    }));
  } else if (facts.buttons.unnamed === 0) {
    checks.push(check({
      id: 'a11y-button-naming', name: 'Buttons have accessible names',
      status: 'pass', measured: 'measured', points: 4,
      evidence: ['All buttons have accessible names.'],
      explanation: 'Buttons carry visible text or aria-labels.'
    }));
  } else {
    checks.push(check({
      id: 'a11y-button-naming', name: 'Buttons have accessible names',
      status: 'warning', severity: 'medium', measured: 'measured', points: 4,
      evidence: [`${facts.buttons.unnamed} of ${facts.buttons.total} button(s) have no visible text or aria-label.`],
      explanation: 'Icon-only buttons without aria-labels are unreadable to screen readers.',
      fix: 'Add aria-label or visible text to icon-only buttons.'
    }));
  }
  // ---- Contrast (not measurable without a browser) ----
  checks.push(check({
    id: 'a11y-contrast', name: 'Colour contrast',
    status: 'not_measured', measured: 'not_applicable', points: 0,
    evidence: ['Contrast requires rendering the page in a browser.'],
    explanation: 'Automated colour-contrast evaluation needs a real browser render (e.g. axe-core or Lighthouse). This serverless scanner cannot measure it.'
  }));

  // ---- Keyboard operability (not fully testable) ----
  checks.push(check({
    id: 'a11y-keyboard', name: 'Keyboard operability indicators',
    status: 'info', measured: 'inferred', points: 0,
    evidence: ['Full keyboard testing requires a browser and manual review.'],
    explanation: 'This scan cannot execute interactive elements. Verify focus order, focus visibility and keyboard handlers in a real browser.'
  }));

  // ---- Automated scope disclaimer ----
  checks.push(check({
    id: 'a11y-conformance-note', name: 'Automated check scope',
    status: 'info', measured: 'not_applicable', points: 0,
    evidence: ['Automated scan only.'],
    explanation: 'Automated checks cannot establish full WCAG conformance. Real accessibility requires manual and assistive-technology testing.',
    docs: [DOCS.wcag, DOCS.axe]
  }));

  return makeCategory('accessibility', checks);
}


