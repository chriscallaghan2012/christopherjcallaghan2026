'use client';

import React, { useEffect, useRef, useState } from 'react';

type HeadingTag = 'h1' | 'h2' | 'h3';
type AccentColor = 'orange' | 'purple';

interface ScrollWritingTitleProps {
  text: string;
  className?: string;
  as?: HeadingTag;
  accentWords?: Array<{ word: string; color: AccentColor }>;
}

export const ScrollWritingTitle: React.FC<ScrollWritingTitleProps> = ({ text, className = '', as = 'h2', accentWords = [] }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const Heading = as;
  let characterIndex = 0;
  const accentMap = new Map(accentWords.map(({ word, color }) => [
    word.toUpperCase().replace(/[^A-Z0-9]/g, ''),
    color === 'orange' ? 'var(--accent-orange)' : 'var(--accent-purple)'
  ]));

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.22 });

    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  return (
    <Heading ref={titleRef} aria-label={text.replace(/\s+/g, ' ').trim()} className={`scroll-writing-title ${isVisible ? 'is-visible' : ''} ${className}`}>
      <span aria-hidden="true" className="whitespace-pre-line">
        {text.split(/(\s+)/).map((token, tokenIndex) => {
          if (/^\s+$/.test(token)) return <span key={`space-${tokenIndex}`}>{token}</span>;

          const accent = accentMap.get(token.toUpperCase().replace(/[^A-Z0-9]/g, ''));
          return <span key={`word-${tokenIndex}`} className="inline-block whitespace-nowrap" style={accent ? { color: accent } : undefined}>
            {Array.from(token).map((character) => {
              const delay = Math.min(characterIndex * 18, 900);
              characterIndex += 1;
              return <span key={`${tokenIndex}-${characterIndex}`} className="scroll-writing-character" style={{ transitionDelay: `${delay}ms` }}>{character}</span>;
            })}
          </span>;
        })}
      </span>
    </Heading>
  );
};