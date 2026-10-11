'use client';

import { SimpleNavbar } from './SimpleNavbar';
import type { ScreenTab } from '../types';

export function BlogSiteHeader() {
  const navigateFromBlog = (tab: ScreenTab) => {
    window.location.assign(tab === 'projects' ? '/projects' : '/build');
  };

  return <SimpleNavbar currentTab="home" activeHref="/blog" onSelectTab={navigateFromBlog} />;
}