'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...arguments_: unknown[]) => void;
  }
}

interface AnalyticsConsentProps {
  measurementId: string;
  tagManagerId: string;
}

export const AnalyticsConsent: React.FC<AnalyticsConsentProps> = ({ measurementId, tagManagerId }) => {
  useEffect(() => {
    if (!/^G-[A-Z0-9]+$/.test(measurementId) && !/^GTM-[A-Z0-9]+$/.test(tagManagerId)) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...arguments_: unknown[]) => window.dataLayer?.push(arguments_));

    const script = document.createElement('script');
    script.async = true;
    script.dataset.cjcAnalytics = 'true';
    if (/^GTM-[A-Z0-9]+$/.test(tagManagerId)) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(tagManagerId)}`;
    } else {
      window.gtag('js', new Date());
      window.gtag('config', measurementId);
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    }
    document.head.appendChild(script);

    return () => {
      script.remove();
      delete window.gtag;
      delete window.dataLayer;
    };
  }, [measurementId, tagManagerId]);

  useEffect(() => {
    const trackPageView = () => {
      window.gtag?.('event', 'page_view', {
        page_location: window.location.href,
        page_title: document.title
      });
    };
    window.addEventListener('cjc:virtual-pageview', trackPageView);
    return () => window.removeEventListener('cjc:virtual-pageview', trackPageView);
  }, []);

  return null;
};