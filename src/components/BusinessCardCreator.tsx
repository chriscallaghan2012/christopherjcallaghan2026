'use client';

import { useMemo, useState } from 'react';
import { Check, Download, Printer, RotateCcw, Sparkles, Bot, Send, LoaderCircle, WandSparkles } from 'lucide-react';

type TemplateId = 'crimson-executive' | 'swiss-minimal' | 'ember-studio' | 'monogram-luxe' | 'split-consultant' | 'signal-grid';
type Side = 'front' | 'back';
type CardSizeId = 'uk' | 'us';

type CardSize = {
  id: CardSizeId;
  name: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  description: string;
};

const CARD_SIZES: CardSize[] = [
  { id: 'uk', name: 'UK standard', widthMm: 85, heightMm: 55, widthPx: 1004, heightPx: 650, description: '85 × 55 mm · UK printers' },
  { id: 'us', name: 'US standard', widthMm: 88.9, heightMm: 50.8, widthPx: 1050, heightPx: 600, description: '3.5 × 2 in · US printers' },
];

const TEMPLATES: { id: TemplateId; name: string; mood: string; description: string; accent: string; background: string; foreground: string }[] = [
  { id: 'crimson-executive', name: 'Crimson Executive', mood: 'Premium · confident', description: 'Dark graphite, sharp crimson detail and a strong typographic hierarchy.', accent: '#F04444', background: '#101012', foreground: '#FFFFFF' },
  { id: 'swiss-minimal', name: 'Swiss Minimal', mood: 'Clean · editorial', description: 'A bright, print-friendly layout with disciplined spacing and a striking red rule.', accent: '#D92535', background: '#F8F7F5', foreground: '#17171B' },
  { id: 'ember-studio', name: 'Ember Studio', mood: 'Warm · creative', description: 'Charcoal and burnt orange for a modern studio or creative consultancy.', accent: '#FF7547', background: '#19110F', foreground: '#FFF7F2' },
  { id: 'monogram-luxe', name: 'Monogram Luxe', mood: 'Refined · understated', description: 'Deep midnight, restrained champagne accents and an elegant monogram.', accent: '#D8B779', background: '#111722', foreground: '#F7F2E8' },
  { id: 'split-consultant', name: 'Split Consultant', mood: 'Structured · versatile', description: 'A bold split-panel composition with contact details kept easy to scan.', accent: '#F04444', background: '#111114', foreground: '#FFFFFF' },
  { id: 'signal-grid', name: 'Signal Grid', mood: 'Digital · technical', description: 'Subtle grid lines, crisp type and a technology-led visual language.', accent: '#FF4D64', background: '#0B1017', foreground: '#F3F6FC' },
];

function xml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function initials(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'C';
}

function makeCardSvg(input: {
  name: string; title: string; specialism: string; email: string; phone: string; website: string; company: string;
  template: TemplateId; side: Side; size: CardSize; bleed: boolean;
}) {
  const { name, title, specialism, email, phone, website, company, template, side, size, bleed } = input;
  const selected = TEMPLATES.find((item) => item.id === template) || TEMPLATES[0];
  const w = size.widthPx;
  const h = size.heightPx;
  const bleedPx = bleed ? Math.round(3 / 25.4 * 300) : 0;
  const canvasW = w + bleedPx * 2;
  const canvasH = h + bleedPx * 2;
  const bg = selected.background;
  const fg = selected.foreground;
  const accent = selected.accent;
  const muted = template === 'swiss-minimal' ? '#55545A' : template === 'monogram-luxe' ? '#C2C7D0' : '#B8BEC9';
  const inset = Math.round(w * 0.055);
  const companyLabel = company.trim();
  const displayName = name.trim() || 'Your Name';
  const displayTitle = title.trim() || 'Your professional title';
  const displayWebsite = website.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  const emailText = email.trim();
  const phoneText = phone.trim();
  const specialty = specialism.trim();
  const esc = xml;
  const parts: string[] = [];
  const add = (s: string) => parts.push(s);
  const rect = (x: number, y: number, width: number, height: number, fill: string, extra = '') => add('<rect x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" fill="' + fill + '" ' + extra + '/>');
  const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, sw = 2, extra = '') => add('<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" fill="none" stroke="' + stroke + '" stroke-width="' + sw + '" ' + extra + '/>');
  const circle = (cx: number, cy: number, r: number, fill: string, extra = '') => add('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" ' + extra + '/>');
  const text = (value: string, x: number, y: number, sizePx: number, fill: string, extra = '') => add('<text x="' + x + '" y="' + y + '" fill="' + fill + '" font-family="Arial, Helvetica, sans-serif" font-size="' + sizePx + '" ' + extra + '>' + esc(value) + '</text>');
  const smallCaps = (value: string, x: number, y: number, fill: string, extra = '') => text(value, x, y, Math.round(w * 0.018), fill, 'font-weight="700" letter-spacing="' + Math.round(w * 0.003) + '" ' + extra);
  const titleSize = Math.min(Math.round(w * 0.046), displayName.length > 24 ? Math.round(w * 0.034) : Math.round(w * 0.046));
  const sideTitle = template === 'monogram-luxe' ? 'STRATEGY  /  TECHNOLOGY  /  GROWTH' : 'TECHNOLOGY. STRATEGY. GROWTH.';
  const background = () => {
    rect(0, 0, canvasW, canvasH, bg);
    add('<g transform="translate(' + bleedPx + ' ' + bleedPx + ')">');
    rect(0, 0, w, h, bg);
  };
  add('<svg xmlns="http://www.w3.org/2000/svg" width="' + (size.widthMm + (bleed ? 6 : 0)) + 'mm" height="' + (size.heightMm + (bleed ? 6 : 0)) + 'mm" viewBox="0 0 ' + canvasW + ' ' + canvasH + '">');
  background();

  if (side === 'front') {
    if (template === 'crimson-executive') {
      rect(0, 0, w, Math.max(8, Math.round(h * 0.022)), accent);
      rect(inset, Math.round(h * 0.14), Math.max(5, Math.round(w * 0.007)), Math.round(h * 0.15), accent, 'rx="2"');
      if (companyLabel) smallCaps(companyLabel.toUpperCase(), inset + 22, Math.round(h * 0.18), accent);
      text(displayName, inset, Math.round(h * 0.43), titleSize, fg, 'font-weight="700" letter-spacing="-0.8"');
      text(displayTitle, inset, Math.round(h * 0.51), Math.round(w * 0.022), accent, 'font-weight="600"');
      line(inset, Math.round(h * 0.58), Math.round(w * 0.66), Math.round(h * 0.58), '#37373F', 2);
      text(specialty || 'AI · DIGITAL · AUTOMATION', inset, Math.round(h * 0.66), Math.round(w * 0.016), muted);
      text(emailText, inset, Math.round(h * 0.78), Math.round(w * 0.016), fg);
      if (phoneText) text('WhatsApp  ' + phoneText, inset, Math.round(h * 0.85), Math.round(w * 0.015), muted);
      text(displayWebsite, w - inset, h - Math.round(h * 0.075), Math.round(w * 0.016), accent, 'text-anchor="end" font-weight="700"');
      add('<path d="M' + Math.round(w * 0.79) + ' 0 L' + w + ' 0 L' + w + ' ' + h + ' L' + Math.round(w * 0.93) + ' ' + h + ' Z" fill="' + accent + '" opacity=".08"/>');
    } else if (template === 'swiss-minimal') {
      rect(0, 0, Math.round(w * 0.025), h, accent);
      smallCaps(companyLabel.toUpperCase() || 'INDEPENDENT CONSULTANCY', inset, Math.round(h * 0.17), accent);
      text(displayName, inset, Math.round(h * 0.38), titleSize, fg, 'font-weight="700" letter-spacing="-0.8"');
      text(displayTitle, inset, Math.round(h * 0.47), Math.round(w * 0.021), fg, 'font-weight="600"');
      rect(inset, Math.round(h * 0.54), Math.round(w * 0.13), 4, accent);
      text(specialty || 'AI · DIGITAL · AUTOMATION', inset, Math.round(h * 0.64), Math.round(w * 0.015), muted);
      text(emailText, inset, Math.round(h * 0.77), Math.round(w * 0.015), fg);
      if (phoneText) text('WhatsApp  ' + phoneText, inset, Math.round(h * 0.84), Math.round(w * 0.015), muted);
      text(displayWebsite, w - inset, h - Math.round(h * 0.075), Math.round(w * 0.015), accent, 'text-anchor="end" font-weight="700"');
      line(Math.round(w * 0.79), Math.round(h * 0.1), Math.round(w * 0.79), Math.round(h * 0.9), '#D9D7D3', 1);
    } else if (template === 'ember-studio') {
      circle(w - inset * 1.5, Math.round(h * 0.3), Math.round(h * 0.27), '#2D1B17', 'opacity=".95"');
      circle(w - inset * 1.5, Math.round(h * 0.3), Math.round(h * 0.18), 'none', 'stroke="' + accent + '" stroke-width="2"');
      rect(inset, Math.round(h * 0.13), Math.round(w * 0.11), 5, accent);
      if (companyLabel) smallCaps(companyLabel.toUpperCase(), inset, Math.round(h * 0.21), accent);
      text(displayName, inset, Math.round(h * 0.4), titleSize, fg, 'font-weight="700"');
      text(displayTitle, inset, Math.round(h * 0.49), Math.round(w * 0.021), accent, 'font-weight="600"');
      text(specialty || 'AI · DIGITAL · AUTOMATION', inset, Math.round(h * 0.6), Math.round(w * 0.015), muted);
      text(emailText, inset, Math.round(h * 0.74), Math.round(w * 0.015), fg);
      if (phoneText) text('WhatsApp  ' + phoneText, inset, Math.round(h * 0.81), Math.round(w * 0.015), muted);
      text(displayWebsite, inset, h - Math.round(h * 0.075), Math.round(w * 0.015), accent, 'font-weight="700"');
    } else if (template === 'monogram-luxe') {
      rect(inset, inset, w - inset * 2, h - inset * 2, 'none', 'stroke="' + accent + '" stroke-width="1"');
      circle(Math.round(w * 0.16), Math.round(h * 0.27), Math.round(h * 0.11), 'none', 'stroke="' + accent + '" stroke-width="2"');
      text(initials(displayName), Math.round(w * 0.16), Math.round(h * 0.29), Math.round(h * 0.075), accent, 'text-anchor="middle" font-family="Georgia, serif"');
      smallCaps(companyLabel.toUpperCase() || 'INDEPENDENT ADVISORY', Math.round(w * 0.32), Math.round(h * 0.2), accent);
      text(displayName, Math.round(w * 0.32), Math.round(h * 0.36), titleSize, fg, 'font-family="Georgia, serif" font-weight="600"');
      text(displayTitle, Math.round(w * 0.32), Math.round(h * 0.45), Math.round(w * 0.019), muted);
      line(Math.round(w * 0.32), Math.round(h * 0.53), Math.round(w * 0.83), Math.round(h * 0.53), accent, 1);
      text(emailText, Math.round(w * 0.32), Math.round(h * 0.65), Math.round(w * 0.014), fg);
      if (phoneText) text('WhatsApp  ' + phoneText, Math.round(w * 0.32), Math.round(h * 0.73), Math.round(w * 0.014), muted);
      text(displayWebsite, Math.round(w * 0.32), Math.round(h * 0.83), Math.round(w * 0.014), accent);
    } else if (template === 'split-consultant') {
      rect(Math.round(w * 0.69), 0, Math.round(w * 0.31), h, accent);
      rect(0, 0, w, 7, accent);
      if (companyLabel) smallCaps(companyLabel.toUpperCase(), inset, Math.round(h * 0.19), accent);
      text(displayName, inset, Math.round(h * 0.39), titleSize, fg, 'font-weight="700"');
      text(displayTitle, inset, Math.round(h * 0.48), Math.round(w * 0.02), accent, 'font-weight="600"');
      text(specialty || 'AI · DIGITAL · AUTOMATION', inset, Math.round(h * 0.59), Math.round(w * 0.014), muted);
      text(emailText, inset, Math.round(h * 0.73), Math.round(w * 0.014), fg);
      if (phoneText) text(phoneText, inset, Math.round(h * 0.81), Math.round(w * 0.014), muted);
      text(displayWebsite, Math.round(w * 0.845), Math.round(h * 0.83), Math.round(w * 0.015), '#FFFFFF', 'text-anchor="middle" font-weight="700"');
      circle(Math.round(w * 0.845), Math.round(h * 0.36), Math.round(h * 0.11), 'none', 'stroke="#FFFFFF" stroke-width="2" opacity=".9"');
      text(initials(displayName), Math.round(w * 0.845), Math.round(h * 0.38), Math.round(h * 0.06), '#FFFFFF', 'text-anchor="middle" font-weight="700"');
    } else {
      for (let x = 0; x <= w; x += Math.round(w * 0.05)) line(x, 0, x, h, '#233140', 1);
      for (let y = 0; y <= h; y += Math.round(h * 0.08)) line(0, y, w, y, '#233140', 1);
      rect(inset, Math.round(h * 0.14), Math.round(w * 0.07), 5, accent);
      smallCaps(companyLabel.toUpperCase() || 'SYSTEMS / STRATEGY / SOFTWARE', inset, Math.round(h * 0.23), accent);
      text(displayName, inset, Math.round(h * 0.43), titleSize, fg, 'font-weight="700"');
      text(displayTitle, inset, Math.round(h * 0.52), Math.round(w * 0.02), accent, 'font-weight="600"');
      text(specialty || 'AI · DIGITAL · AUTOMATION', inset, Math.round(h * 0.64), Math.round(w * 0.015), muted);
      text(emailText, inset, Math.round(h * 0.77), Math.round(w * 0.015), fg);
      if (phoneText) text('WhatsApp  ' + phoneText, inset, Math.round(h * 0.84), Math.round(w * 0.014), muted);
      text(displayWebsite, w - inset, h - Math.round(h * 0.075), Math.round(w * 0.015), accent, 'text-anchor="end" font-weight="700"');
      circle(w - inset * 1.3, Math.round(h * 0.2), Math.round(h * 0.045), accent, 'opacity=".9"');
    }
  } else {
    if (template === 'swiss-minimal') {
      rect(0, 0, w, Math.round(h * 0.035), accent);
      text(initials(displayName), w / 2, Math.round(h * 0.39), Math.round(h * 0.15), accent, 'font-weight="700" text-anchor="middle"');
      line(Math.round(w * 0.4), Math.round(h * 0.49), Math.round(w * 0.6), Math.round(h * 0.49), accent, 3);
      text(companyLabel || displayName, w / 2, Math.round(h * 0.62), Math.round(w * 0.034), fg, 'font-weight="700" text-anchor="middle"');
      text(sideTitle, w / 2, Math.round(h * 0.72), Math.round(w * 0.014), muted, 'text-anchor="middle" letter-spacing="1"');
      text(displayWebsite, w / 2, Math.round(h * 0.85), Math.round(w * 0.018), accent, 'font-weight="700" text-anchor="middle"');
    } else if (template === 'ember-studio') {
      circle(w / 2, Math.round(h * 0.37), Math.round(h * 0.18), '#2D1B17');
      circle(w / 2, Math.round(h * 0.37), Math.round(h * 0.14), 'none', 'stroke="' + accent + '" stroke-width="2"');
      text(initials(displayName), w / 2, Math.round(h * 0.4), Math.round(h * 0.075), accent, 'text-anchor="middle" font-weight="700"');
      text(companyLabel || displayName, w / 2, Math.round(h * 0.68), Math.round(w * 0.034), fg, 'text-anchor="middle" font-weight="700"');
      text('THOUGHTFUL DIGITAL. REAL-WORLD IMPACT.', w / 2, Math.round(h * 0.79), Math.round(w * 0.014), muted, 'text-anchor="middle"');
      text(displayWebsite, w / 2, Math.round(h * 0.89), Math.round(w * 0.018), accent, 'text-anchor="middle" font-weight="700"');
    } else if (template === 'monogram-luxe') {
      rect(inset, inset, w - inset * 2, h - inset * 2, 'none', 'stroke="' + accent + '" stroke-width="1"');
      circle(w / 2, Math.round(h * 0.33), Math.round(h * 0.15), 'none', 'stroke="' + accent + '" stroke-width="2"');
      text(initials(displayName), w / 2, Math.round(h * 0.36), Math.round(h * 0.09), accent, 'text-anchor="middle" font-family="Georgia, serif"');
      text(companyLabel || displayName, w / 2, Math.round(h * 0.62), Math.round(w * 0.034), fg, 'text-anchor="middle" font-family="Georgia, serif"');
      line(Math.round(w * 0.39), Math.round(h * 0.7), Math.round(w * 0.61), Math.round(h * 0.7), accent, 1);
      text(sideTitle, w / 2, Math.round(h * 0.79), Math.round(w * 0.012), muted, 'text-anchor="middle" letter-spacing="1"');
      text(displayWebsite, w / 2, Math.round(h * 0.89), Math.round(w * 0.018), accent, 'text-anchor="middle"');
    } else if (template === 'split-consultant') {
      rect(0, 0, w, Math.round(h * 0.17), accent);
      text(companyLabel || displayName, w / 2, Math.round(h * 0.115), Math.round(w * 0.034), '#FFFFFF', 'text-anchor="middle" font-weight="700"');
      text('WHAT I HELP WITH', inset, Math.round(h * 0.32), Math.round(w * 0.017), accent, 'font-weight="700" letter-spacing="1.5"');
      text(specialty || 'AI · DIGITAL · AUTOMATION', inset, Math.round(h * 0.43), Math.round(w * 0.019), fg);
      text('LET’S TALK', inset, Math.round(h * 0.62), Math.round(w * 0.02), accent, 'font-weight="700"');
      text(emailText, inset, Math.round(h * 0.72), Math.round(w * 0.018), fg);
      if (phoneText) text('WhatsApp  ' + phoneText, inset, Math.round(h * 0.8), Math.round(w * 0.017), muted);
      text(displayWebsite, inset, Math.round(h * 0.9), Math.round(w * 0.018), accent, 'font-weight="700"');
    } else if (template === 'signal-grid') {
      for (let x = 0; x <= w; x += Math.round(w * 0.05)) line(x, 0, x, h, '#233140', 1);
      for (let y = 0; y <= h; y += Math.round(h * 0.08)) line(0, y, w, y, '#233140', 1);
      circle(w / 2, Math.round(h * 0.31), Math.round(h * 0.13), 'none', 'stroke="' + accent + '" stroke-width="2"');
      text(initials(displayName), w / 2, Math.round(h * 0.34), Math.round(h * 0.07), accent, 'text-anchor="middle" font-weight="700"');
      text(companyLabel || displayName, w / 2, Math.round(h * 0.61), Math.round(w * 0.033), fg, 'text-anchor="middle" font-weight="700"');
      text(sideTitle, w / 2, Math.round(h * 0.72), Math.round(w * 0.014), muted, 'text-anchor="middle" letter-spacing="1"');
      text(displayWebsite, w / 2, Math.round(h * 0.85), Math.round(w * 0.018), accent, 'text-anchor="middle" font-weight="700"');
    } else {
      rect(0, 0, w, Math.max(8, Math.round(h * 0.022)), accent);
      circle(w / 2, Math.round(h * 0.33), Math.round(h * 0.13), 'none', 'stroke="' + accent + '" stroke-width="3"');
      text(initials(displayName), w / 2, Math.round(h * 0.36), Math.round(h * 0.075), accent, 'text-anchor="middle" font-weight="700"');
      text(companyLabel || displayName, w / 2, Math.round(h * 0.62), Math.round(w * 0.035), fg, 'text-anchor="middle" font-weight="700"');
      text(sideTitle, w / 2, Math.round(h * 0.73), Math.round(w * 0.014), muted, 'text-anchor="middle" letter-spacing="1"');
      text(displayWebsite, w / 2, Math.round(h * 0.86), Math.round(w * 0.018), accent, 'text-anchor="middle" font-weight="700"');
    }
  }

  add('</g>');
  add('</svg>');
  return parts.join('');
}

export default function BusinessCardCreator() {
  const [name, setName] = useState('Christopher J. Callaghan');
  const [title, setTitle] = useState('Business Advisor & Full-Stack Developer');
  const [specialism, setSpecialism] = useState('AI Integration · Web & App Development · Automation');
  const [email, setEmail] = useState('christopher@christopherjcallaghan.com');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('christopherjcallaghan.com');
  const [company, setCompany] = useState('');
  const [template, setTemplate] = useState<TemplateId>('crimson-executive');
  const [side, setSide] = useState<Side>('front');
  const [sizeId, setSizeId] = useState<CardSizeId>('uk');
  const [bleed, setBleed] = useState(true);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [assistantSuggestion, setAssistantSuggestion] = useState<Record<string, string> | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState('');
  const [assistantNeedsKey, setAssistantNeedsKey] = useState(false);
  const size = CARD_SIZES.find((item) => item.id === sizeId) || CARD_SIZES[0];
  const selectedTemplate = TEMPLATES.find((item) => item.id === template) || TEMPLATES[0];
  const artwork = useMemo(() => makeCardSvg({ name, title, specialism, email, phone, website, company, template, side, size, bleed: false }), [name, title, specialism, email, phone, website, company, template, side, size]);
  const svgForExport = useMemo(() => makeCardSvg({ name, title, specialism, email, phone, website, company, template, side, size, bleed }), [name, title, specialism, email, phone, website, company, template, side, size, bleed]);

  const downloadSvg = () => {
    const blob = new Blob([svgForExport], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-card-' + sizeId + '-' + template + '-' + side + (bleed ? '-3mm-bleed' : '') + '.svg';
    a.click();
    // Keep the object URL alive briefly so browsers can finish reading the download.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadPng = () => {
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svgForExport], { type: 'image/svg+xml;charset=utf-8' }));
    image.onload = () => {
      const bleedPx = bleed ? Math.round(3 / 25.4 * 300) : 0;
      const canvas = document.createElement('canvas');
      canvas.width = size.widthPx + bleedPx * 2;
      canvas.height = size.heightPx + bleedPx * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const a = document.createElement('a');
          a.download = 'business-card-' + sizeId + '-' + template + '-' + side + (bleed ? '-3mm-bleed' : '') + '.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
        } catch {
          setAssistantError('The PNG could not be exported by this browser. Try the SVG download or use a current browser.');
        }
      } else {
        setAssistantError('PNG export is unavailable because this browser could not create a canvas. Try the SVG download.');
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    image.onerror = () => {
      setAssistantError('The card artwork could not be rendered as a PNG. Try the SVG download or use a current browser.');
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const reset = () => {
    setName('Christopher J. Callaghan');
    setTitle('Business Advisor & Full-Stack Developer');
    setSpecialism('AI Integration · Web & App Development · Automation');
    setEmail('christopher@christopherjcallaghan.com');
    setPhone('');
    setWebsite('christopherjcallaghan.com');
    setCompany('');
    setTemplate('crimson-executive');
    setSide('front');
    setSizeId('uk');
    setBleed(true);
  };

  const askAssistant = async (promptOverride?: string) => {
    const prompt = (promptOverride ?? assistantPrompt).trim();
    if (!prompt || assistantLoading) return;
    setAssistantPrompt(prompt);
    setAssistantLoading(true);
    setAssistantError('');
    setAssistantReply('');
    setAssistantSuggestion(null);
    setAssistantNeedsKey(false);
    try {
      const response = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'business-card-assistant',
          prompt,
          current: { name, title, specialism, email, phone, website, company, template },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAssistantNeedsKey(Boolean(data.needsApiKey));
        throw new Error(data.error || 'The assistant could not complete that request.');
      }
      setAssistantReply(typeof data.reply === 'string' ? data.reply : 'I have prepared some improvements for your card.');
      setAssistantSuggestion(data.suggested && typeof data.suggested === 'object' ? data.suggested : null);
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setAssistantLoading(false);
    }
  };

  const applyAssistantSuggestion = () => {
    if (!assistantSuggestion) return;
    if (assistantSuggestion.name) setName(assistantSuggestion.name);
    if (assistantSuggestion.title) setTitle(assistantSuggestion.title);
    if (assistantSuggestion.specialism) setSpecialism(assistantSuggestion.specialism);
    if (assistantSuggestion.email) setEmail(assistantSuggestion.email);
    if (assistantSuggestion.phone) setPhone(assistantSuggestion.phone);
    if (assistantSuggestion.website) setWebsite(assistantSuggestion.website);
    if (assistantSuggestion.company) setCompany(assistantSuggestion.company);
    if (assistantSuggestion.template && TEMPLATES.some((item) => item.id === assistantSuggestion.template)) {
      setTemplate(assistantSuggestion.template as TemplateId);
    }
    setAssistantReply('Applied. Check the live preview and edit anything you want before exporting.');
    setAssistantSuggestion(null);
  };

  const field = (label: string, value: string, setter: (v: string) => void, placeholder?: string) => (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[.12em] text-white/55">{label}</span>
      <input aria-label={label} value={value} placeholder={placeholder} onChange={(event) => setter(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0B0B0E] px-3.5 py-3 text-sm text-white outline-none transition focus:border-[#F04444] focus:ring-2 focus:ring-[#F04444]/15 placeholder:text-white/25" />
    </label>
  );

  return (
    <main className="min-h-screen bg-[#08080A] px-4 py-7 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="print-hide mb-8 flex items-center justify-between gap-4">
          <a href="/tools" className="text-sm text-white/55 transition hover:text-white">← All tools</a>
          <span className="inline-flex items-center gap-2 border border-[#F04444]/25 bg-[#F04444]/[.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-[#FF7777]"><Sparkles size={13} /> Print-ready studio</span>
        </div>
        <header className="print-hide mb-8 max-w-4xl">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[.24em] text-[#FF5575]">CJC DESIGN STUDIO / FREE TOOL</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-5xl">Business Card Studio<span className="text-[#F04444]">.</span></h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">Choose a premium layout, make it yours, and export correctly sized artwork. Your details stay in this browser — nothing is submitted.</p>
        </header>

        <div className="print-hide mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((item) => (
            <button key={item.id} type="button" onClick={() => setTemplate(item.id)} aria-pressed={template === item.id} className={'group flex min-w-0 items-center gap-3 rounded-2xl border p-3 text-left transition ' + (template === item.id ? 'border-[#F04444]/80 bg-[#F04444]/[.07] ring-1 ring-[#F04444]/20' : 'border-white/10 bg-white/[.025] hover:border-white/25 hover:bg-white/[.045]')}>
              <span className="relative block h-[52px] w-[78px] shrink-0 overflow-hidden rounded-md border border-white/15 shadow-lg" style={{ background: item.background }}>
                <span className="absolute left-0 top-0 h-1 w-full" style={{ background: item.accent }} />
                <span className="absolute left-2 top-[15px] h-[3px] w-8 rounded-full" style={{ background: item.accent }} />
                <span className="absolute left-2 top-[23px] h-[5px] w-12 rounded-sm" style={{ background: item.foreground, opacity: .9 }} />
                <span className="absolute left-2 top-[32px] h-[2px] w-9 rounded-full" style={{ background: item.foreground, opacity: .45 }} />
                {item.id === 'split-consultant' && <span className="absolute right-0 top-0 h-full w-4" style={{ background: item.accent }} />}
                {item.id === 'monogram-luxe' && <span className="absolute right-2 top-3 h-5 w-5 rounded-full border" style={{ borderColor: item.accent }} />}
                {item.id === 'signal-grid' && <span className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, #7D90A8 1px, transparent 1px), linear-gradient(#7D90A8 1px, transparent 1px)', backgroundSize: '8px 8px' }} />}
                {template === item.id && <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F04444] text-white"><Check size={10} /></span>}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white">{item.name}</span>
                <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[.12em] text-white/40">{item.mood}</span>
                <span className="mt-1 line-clamp-2 block text-xs leading-4 text-white/55">{item.description}</span>
              </span>
            </button>
          ))}
        </div>

        <section className="print-hide mb-7 overflow-hidden rounded-2xl border border-[#F04444]/25 bg-[radial-gradient(ellipse_at_top_left,rgba(240,68,68,.12),transparent_55%),#111114]">
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[#FF7777]"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F04444]/25 bg-[#F04444]/10"><Bot size={18} /></span><div><p className="font-mono text-[10px] uppercase tracking-[.2em]">AI design assistant</p><h2 className="text-lg font-bold text-white">Tell me what you want your card to say.</h2></div></div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">Get help with your positioning, wording, template choice and visual hierarchy. The assistant proposes changes first — nothing is applied until you choose.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  'Make this feel more premium and high-end',
                  'Position me as an AI business advisor',
                  'Make the card cleaner and easier to read',
                ].map((prompt) => <button key={prompt} type="button" onClick={() => setAssistantPrompt(prompt)} className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-left text-xs text-white/65 transition hover:border-[#F04444]/50 hover:text-white">{prompt}</button>)}
              </div>
              <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void askAssistant(); }}>
                <input aria-label="Ask the AI design assistant" value={assistantPrompt} onChange={(event) => setAssistantPrompt(event.target.value)} maxLength={900} placeholder="e.g. Make the wording clearer for business owners…" className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#09090B] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#F04444]/70 focus:ring-2 focus:ring-[#F04444]/10" />
                <button type="submit" disabled={assistantLoading || !assistantPrompt.trim()} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F04444] px-5 text-sm font-bold text-white transition hover:bg-[#D93636] disabled:cursor-not-allowed disabled:opacity-50">{assistantLoading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}{assistantLoading ? 'Thinking…' : 'Ask assistant'}</button>
              </form>
              {assistantError && <div role="alert" className="mt-3 rounded-xl border border-amber-400/20 bg-amber-300/[.06] p-3 text-sm leading-6 text-amber-100/90">{assistantError}{assistantNeedsKey && <p className="mt-2 text-xs text-amber-100/70">Use the existing Gemini setup: add <code className="rounded bg-black/30 px-1.5 py-0.5">GEMINI_API_KEY</code> to <code className="rounded bg-black/30 px-1.5 py-0.5">.env.local</code> locally and the Vercel project’s environment variables. Keep it server-side; don’t put it in client code.</p>}</div>}
              {(assistantReply || assistantSuggestion) && <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#FF7777]"><WandSparkles size={14} /> Suggested direction</p>
                {assistantReply && <p className="mt-2 text-sm leading-6 text-white/75">{assistantReply}</p>}
                {assistantSuggestion && <div className="mt-3 flex flex-wrap items-center gap-2">
                  {assistantSuggestion.template && <span className="rounded-full border border-[#F04444]/25 bg-[#F04444]/10 px-3 py-1.5 text-xs text-white/80">Template: {TEMPLATES.find((item) => item.id === assistantSuggestion.template)?.name || assistantSuggestion.template}</span>}
                  {assistantSuggestion.title && <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs text-white/65">Title: {assistantSuggestion.title}</span>}
                  {assistantSuggestion.specialism && <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs text-white/65">Focus: {assistantSuggestion.specialism}</span>}
                  <button type="button" onClick={applyAssistantSuggestion} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-xs font-bold text-black transition hover:bg-white/85"><Check size={14} /> Apply suggestions</button>
                </div>}
              </div>}
            </div>
            <div className="hidden min-w-[150px] flex-col items-end gap-2 pt-1 text-right lg:flex"><span className="inline-flex items-center gap-1.5 rounded-full border border-[#F04444]/20 bg-[#F04444]/[.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.12em] text-[#FF7777]"><Sparkles size={12} /> Brand co-pilot</span><span className="max-w-[150px] text-xs leading-5 text-white/35">You stay in control of every edit and export.</span></div>
          </div>
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[370px_minmax(0,1fr)]">
          <section className="print-hide rounded-2xl border border-white/10 bg-[#111114] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#FF5575]">01 / Personalise</p><h2 className="mt-1 text-lg font-bold">Your card details</h2></div>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-xs text-white/45 transition hover:text-white"><RotateCcw size={13} /> Reset</button>
            </div>
            <div className="space-y-4">
              {field('Name', name, setName, 'Your name')}
              {field('Professional title', title, setTitle, 'e.g. Business Advisor')}
              {field('Services / specialism', specialism, setSpecialism, 'AI · Web · Automation')}
              {field('Email', email, setEmail, 'you@example.com')}
              {field('Phone / WhatsApp number', phone, setPhone, '+44…')}
              {field('Website', website, setWebsite, 'yourwebsite.com')}
              {field('Business / brand name', company, setCompany, 'Optional')}
            </div>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-white/45">02 / Print format</p>
              <div className="grid grid-cols-2 gap-2">
                {CARD_SIZES.map((item) => (
                  <button type="button" key={item.id} onClick={() => setSizeId(item.id)} aria-pressed={sizeId === item.id} className={'rounded-xl border p-3 text-left transition ' + (sizeId === item.id ? 'border-[#F04444]/70 bg-[#F04444]/[.08]' : 'border-white/10 bg-black/20 hover:border-white/25')}>
                    <span className="block text-sm font-bold">{item.name}</span>
                    <span className="mt-1 block text-[11px] text-white/45">{item.description}</span>
                  </button>
                ))}
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                <input type="checkbox" checked={bleed} onChange={(event) => setBleed(event.target.checked)} className="mt-0.5 accent-[#F04444]" />
                <span><span className="block text-sm font-semibold">Add 3 mm bleed</span><span className="mt-1 block text-xs leading-5 text-white/45">Recommended for print shops. Exports the artwork at 91 × 61 mm (UK) or with 3 mm added on every edge for US size.</span></span>
              </label>
            </div>
          </section>

          <section className="min-w-0">
            <div className="print-hide mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#FF5575]">03 / Preview</p><h2 className="mt-1 text-lg font-bold">{selectedTemplate.name}</h2><p className="mt-1 text-xs text-white/45">{size.widthMm === 85 ? '85 × 55 mm trim size' : '3.5 × 2 in trim size'} · {Math.round(size.widthPx / size.widthMm * 25.4)} DPI export canvas</p></div>
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#111114] p-1">
                {(['front', 'back'] as Side[]).map((item) => <button key={item} type="button" onClick={() => setSide(item)} aria-pressed={side === item} className={'rounded-lg px-4 py-2 text-sm capitalize transition ' + (side === item ? 'bg-white/10 font-semibold text-white' : 'text-white/45 hover:text-white')}>{item}</button>)}
              </div>
            </div>
            <div className="business-card-preview rounded-2xl border border-white/10 bg-[#111114] p-4 sm:p-7">
              <div className="mx-auto w-full max-w-[1000px] overflow-hidden rounded-md shadow-[0_28px_90px_rgba(0,0,0,.45)]" style={{ aspectRatio: size.widthPx + ' / ' + size.heightPx }} dangerouslySetInnerHTML={{ __html: artwork }} />
              <div className="print-hide mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/35"><span>Live artwork preview · {size.widthMm} × {size.heightMm} mm</span><span>Final trim edge shown without bleed</span></div>
            </div>
            <div className="print-hide mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={downloadPng} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#F04444] px-5 text-sm font-bold text-white shadow-lg shadow-[#F04444]/10 transition hover:bg-[#D93636]"><Download size={16} /> Download PNG</button>
              <button type="button" onClick={downloadSvg} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[.03] px-5 text-sm font-bold text-white transition hover:bg-white/[.08]"><Download size={16} /> Download SVG</button>
              <button type="button" onClick={() => window.print()} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[.03] px-5 text-sm font-bold text-white transition hover:bg-white/[.08]"><Printer size={16} /> Print / Save PDF</button>
            </div>
            <p className="print-hide mt-4 max-w-3xl text-xs leading-6 text-white/40">PNG exports at 300 DPI. SVG is vector artwork and scales without losing sharpness. For commercial printing, ask your printer whether they need bleed, crop marks, CMYK colour or a PDF/X file; this tool exports RGB artwork, not a certified press-ready PDF.</p>
          </section>
        </div>
      </div>
      <style>{'.business-card-preview svg { width: 100%; height: 100%; display: block; } @media print { @page { size: ' + (size.widthMm + (bleed ? 6 : 0)) + 'mm ' + (size.heightMm + (bleed ? 6 : 0)) + 'mm; margin: 0; } html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; } body * { visibility: hidden !important; } .print-hide { display: none !important; } .business-card-preview, .business-card-preview * { visibility: visible !important; } .business-card-preview { position: absolute !important; left: 0 !important; top: 0 !important; width: ' + (size.widthMm + (bleed ? 6 : 0)) + 'mm !important; height: ' + (size.heightMm + (bleed ? 6 : 0)) + 'mm !important; padding: 0 !important; margin: 0 !important; border: 0 !important; border-radius: 0 !important; background: #fff !important; } .business-card-preview > div { width: ' + (size.widthMm + (bleed ? 6 : 0)) + 'mm !important; height: ' + (size.heightMm + (bleed ? 6 : 0)) + 'mm !important; aspect-ratio: auto !important; max-width: none !important; border-radius: 0 !important; box-shadow: none !important; } .business-card-preview svg { display: block !important; width: ' + (size.widthMm + (bleed ? 6 : 0)) + 'mm !important; height: ' + (size.heightMm + (bleed ? 6 : 0)) + 'mm !important; } }'}</style>
    </main>
  );
}
