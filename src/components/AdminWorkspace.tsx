'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, LoaderCircle, LogOut, Plus, Save, Send, Sparkles, Trash2 } from 'lucide-react';
import type { BlogPost, BlogPostInput, BlogPostStatus } from '../../lib/database';

type AdminMode = 'checking' | 'login' | 'unconfigured' | 'workspace';

const blankPost: BlogPostInput = {
  title: '',
  slug: '',
  excerpt: '',
  contentMarkdown: '',
  metaTitle: '',
  metaDescription: '',
  aiPrompt: '',
  status: 'draft'
};

export const AdminWorkspace: React.FC = () => {
  const [mode, setMode] = useState<AdminMode>('checking');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [post, setPost] = useState<BlogPostInput>(blankPost);
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const loadPosts = async () => {
    const response = await fetch('/api/admin/posts', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not load posts.');
    setPosts(result.posts);
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/session', { cache: 'no-store' })
      .then(async (response) => ({ response, result: await response.json() }))
      .then(async ({ result }) => {
        if (cancelled) return;
        if (!result.configured) {
          setMode('unconfigured');
          return;
        }
        if (!result.authenticated) {
          setMode('login');
          return;
        }
        try {
          await loadPosts();
          if (!cancelled) setMode('workspace');
        } catch (loadError) {
          if (!cancelled) {
            setMode('workspace');
            setError(loadError instanceof Error ? loadError.message : 'Could not load posts.');
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMode('login');
          setError('Could not connect to the admin service.');
        }
      });
    return () => { cancelled = true; };
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsWorking(true);
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not sign in.');
      setPassword('');
      await loadPosts();
      setMode('workspace');
      setError('');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Could not sign in.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    setPosts([]);
    setPost(blankPost);
    setMode('login');
  };

  const generateDraft = async () => {
    if (post.aiPrompt.trim().length < 20) {
      setError('Describe the topic in at least 20 characters.');
      return;
    }
    setIsWorking(true);
    setError('');
    setNotice('Generating a draft…');
    try {
      const response = await fetch('/api/admin/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: post.aiPrompt })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not generate a draft.');
      setPost(result.post);
      setNotice('Draft generated. Review and edit it before saving or publishing.');
    } catch (generationError) {
      setNotice('');
      setError(generationError instanceof Error ? generationError.message : 'Could not generate a draft.');
    } finally {
      setIsWorking(false);
    }
  };

  const savePost = async (status: BlogPostStatus) => {
    setIsWorking(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, status })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save the post.');
      setPost(result.post);
      await loadPosts();
      setNotice(status === 'published' ? 'Post published.' : 'Draft saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save the post.');
    } finally {
      setIsWorking(false);
    }
  };

  const removePost = async () => {
    if (!post.id || !window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setIsWorking(true);
    try {
      const response = await fetch(`/api/admin/posts?id=${encodeURIComponent(post.id)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete the post.');
      setPost(blankPost);
      await loadPosts();
      setNotice('Post deleted.');
      setError('');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the post.');
    } finally {
      setIsWorking(false);
    }
  };

  if (mode === 'checking') return <main className="mx-auto flex min-h-[70svh] max-w-7xl items-center px-5 py-16 md:px-8"><p className="font-mono text-xs text-white/50">CHECKING ADMIN SESSION…</p></main>;

  if (mode === 'unconfigured') {
    return <main className="mx-auto min-h-[70svh] max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#FFB347]">Admin / setup required</p>
      <h1 className="mt-4 text-4xl font-black text-white">Configure private access.</h1>
      <p className="mt-5 text-sm leading-relaxed text-white/65">Set <code className="text-[#FFB347]">ADMIN_PASSWORD</code> and a random <code className="text-[#DF80FF]">ADMIN_SESSION_SECRET</code> of at least 32 characters in the server environment, then restart the app.</p>
    </main>;
  }

  if (mode === 'login') {
    return <main className="mx-auto min-h-[70svh] max-w-xl px-5 py-16 md:px-8 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#FF003C]">Private / publishing desk</p>
      <h1 className="mt-4 text-4xl font-black text-white">Admin sign in.</h1>
      <form onSubmit={handleLogin} className="mt-8 space-y-4 border-y border-white/10 py-7">
        <label className="block font-mono text-xs uppercase tracking-widest text-white/60">Admin password
          <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full border border-white/15 bg-white/[0.03] px-4 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#FFB347]" />
        </label>
        {error && <p role="alert" className="text-sm text-[#FF6F91]">{error}</p>}
        <button disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 bg-[#FF003C] px-5 font-mono text-xs font-bold tracking-widest text-white disabled:opacity-60">{isWorking && <LoaderCircle className="h-4 w-4 animate-spin" />}SIGN IN</button>
      </form>
    </main>;
  }

  return <main className="mx-auto min-h-[75svh] max-w-7xl px-5 py-10 md:px-8 md:py-14">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#FF003C]">Private / publishing desk</p>
        <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">Blog posts</h1>
      </div>
      <button onClick={handleLogout} className="inline-flex min-h-10 items-center gap-2 border border-white/15 px-4 font-mono text-[10px] font-bold tracking-widest text-white/70 hover:text-white"><LogOut className="h-4 w-4" /> SIGN OUT</button>
    </div>

    <div className="mt-7 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-white/55">All posts</h2>
          <button onClick={() => { setPost(blankPost); setError(''); setNotice(''); }} aria-label="New post" className="flex h-9 w-9 items-center justify-center border border-white/15 text-white hover:border-[#FFB347]"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {posts.map((item) => <button key={item.id} onClick={() => { setPost(item); setNotice(''); setError(''); }} className={`block w-full py-4 text-left ${post.id === item.id ? 'text-white' : 'text-white/60 hover:text-white'}`}>
            <span className="block text-sm font-semibold leading-snug">{item.title}</span>
            <span className={`mt-2 block font-mono text-[9px] uppercase tracking-widest ${item.status === 'published' ? 'text-[#FFB347]' : 'text-[#DF80FF]'}`}>{item.status}</span>
          </button>)}
          {!posts.length && <p className="py-5 text-xs leading-relaxed text-white/45">No posts yet. Generate or write your first draft.</p>}
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/45"><span>{post.id ? 'Edit post' : 'New post'}</span><span>/</span><span className={post.status === 'published' ? 'text-[#FFB347]' : 'text-[#DF80FF]'}>{post.status}</span></div>
          {post.id && post.status === 'published' && <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#FFB347] hover:text-white">VIEW LIVE <ExternalLink className="h-3.5 w-3.5" /></a>}
        </div>

        <div className="mb-8 border-y border-white/10 py-5">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/55">AI draft prompt
            <textarea value={post.aiPrompt} onChange={(event) => setPost({ ...post, aiPrompt: event.target.value })} rows={3} maxLength={8000} placeholder="What should this article explain, who is it for, and what should readers take away?" className="mt-2 w-full resize-y border border-white/15 bg-white/[0.03] px-4 py-3 font-sans text-sm normal-case leading-relaxed tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#DF80FF]" />
          </label>
          <button onClick={generateDraft} disabled={isWorking} className="mt-3 inline-flex min-h-10 items-center gap-2 border border-[#DF80FF]/60 px-4 font-mono text-[10px] font-bold tracking-widest text-[#DF80FF] hover:bg-[#DF80FF]/10 disabled:opacity-50"><Sparkles className="h-4 w-4" /> GENERATE DRAFT</button>
          <p className="mt-2 text-xs text-white/40">AI output stays a draft until you review and publish it.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/55">Title<input value={post.title} onChange={(event) => setPost({ ...post, title: event.target.value })} maxLength={140} className="mt-2 min-h-11 w-full border border-white/15 bg-white/[0.03] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#FFB347]" /></label>
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/55">URL slug<input value={post.slug} onChange={(event) => setPost({ ...post, slug: event.target.value })} maxLength={120} className="mt-2 min-h-11 w-full border border-white/15 bg-white/[0.03] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#FFB347]" /></label>
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/55 md:col-span-2">Excerpt<textarea value={post.excerpt} onChange={(event) => setPost({ ...post, excerpt: event.target.value })} rows={2} maxLength={420} className="mt-2 w-full resize-y border border-white/15 bg-white/[0.03] px-3 py-2 font-sans text-sm normal-case leading-relaxed tracking-normal text-white outline-none focus:border-[#FFB347]" /></label>
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/55">SEO title<input value={post.metaTitle} onChange={(event) => setPost({ ...post, metaTitle: event.target.value })} maxLength={180} className="mt-2 min-h-11 w-full border border-white/15 bg-white/[0.03] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#FFB347]" /></label>
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/55">SEO description<input value={post.metaDescription} onChange={(event) => setPost({ ...post, metaDescription: event.target.value })} maxLength={320} className="mt-2 min-h-11 w-full border border-white/15 bg-white/[0.03] px-3 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#FFB347]" /></label>
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/55 md:col-span-2">Article (Markdown)<textarea value={post.contentMarkdown} onChange={(event) => setPost({ ...post, contentMarkdown: event.target.value })} rows={18} maxLength={60000} className="mt-2 w-full resize-y border border-white/15 bg-white/[0.03] px-3 py-3 font-mono text-xs leading-relaxed text-white outline-none focus:border-[#FFB347]" /></label>
        </div>

        {(error || notice) && <p role={error ? 'alert' : 'status'} className={`mt-5 text-sm ${error ? 'text-[#FF6F91]' : 'text-[#FFB347]'}`}>{error || notice}</p>}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <button onClick={() => savePost('draft')} disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 font-mono text-xs font-bold tracking-widest text-white disabled:opacity-50"><Save className="h-4 w-4" /> SAVE DRAFT</button>
          <button onClick={() => savePost('published')} disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 bg-[#FF003C] px-5 font-mono text-xs font-bold tracking-widest text-white disabled:opacity-50"><Send className="h-4 w-4" /> PUBLISH</button>
          {post.id && <button onClick={removePost} disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 border border-[#FF6F91]/40 px-4 font-mono text-xs font-bold tracking-widest text-[#FF6F91] disabled:opacity-50"><Trash2 className="h-4 w-4" /> DELETE</button>}
        </div>
      </section>
    </div>
  </main>;
};