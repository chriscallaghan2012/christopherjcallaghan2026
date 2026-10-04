'use client';

import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, MousePointer2, X } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import type { SystemMapContent, SystemMapNode } from '../types';

interface SystemMapProps extends SystemMapContent {
  eyebrow?: string;
}

const groups: Array<{ id: SystemMapNode['group']; label: string }> = [
  { id: 'source', label: 'INPUTS' },
  { id: 'work', label: 'WORK' },
  { id: 'outcome', label: 'OUTPUT' }
];

const groupStyles: Record<SystemMapNode['group'], string> = {
  source: 'border-white/20 text-white/75',
  work: 'border-[#FF003C]/50 text-white',
  outcome: 'border-[#00DFC9]/50 text-white'
};

const chartWidth = 1040;
const nodeWidth = 274;
const nodeLeft: Record<SystemMapNode['group'], number> = {
  source: 8,
  work: 383,
  outcome: 758
};

export const SystemMap: React.FC<SystemMapProps> = ({ title, intro, nodes, connections, eyebrow = 'Inside the system' }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const groupedNodes = groups.map((group) => ({
    ...group,
    nodes: nodes.filter((node) => node.group === group.id)
  }));
  const slotHeight = 112;
  const maxNodeCount = Math.max(...groupedNodes.map((group) => group.nodes.length), 1);
  const chartHeight = maxNodeCount * slotHeight + 12;
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;
  const nodePositions = new Map<string, { x: number; y: number }>();

  useEffect(() => {
    if (!selectedNode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedNodeId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedNode]);

  groupedNodes.forEach((group) => {
    const offset = (maxNodeCount - group.nodes.length) / 2;
    group.nodes.forEach((node, index) => {
      nodePositions.set(node.id, {
        x: nodeLeft[group.id],
        y: 6 + (offset + index + 0.5) * slotHeight
      });
    });
  });

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.3, ease: 'easeOut' }}>
      <section className="border-y border-white/10 bg-[#09090c] py-12 md:py-16" aria-labelledby="system-map-title">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <header className="mb-6 max-w-3xl">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">{eyebrow}</p>
            <h2 id="system-map-title" className="text-2xl font-black text-white md:text-3xl">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">{intro}</p>
            <p className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45"><MousePointer2 className="h-3.5 w-3.5" /> Select a node to inspect it</p>
          </header>

          <div className="hidden border border-white/10 bg-[#08080a] p-4 md:block md:p-5" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.13) 0.7px, transparent 0.7px)', backgroundSize: '22px 22px' }}>
            <div className="grid grid-cols-3 gap-4 px-2 pb-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
              {groups.map((group) => <span key={group.id}>{group.label}</span>)}
            </div>
            <div className="relative overflow-hidden" style={{ height: chartHeight }}>
              <svg aria-hidden="true" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                {connections.map(([sourceId, targetId]) => {
                  const source = nodes.find((node) => node.id === sourceId);
                  const target = nodes.find((node) => node.id === targetId);
                  const sourcePosition = nodePositions.get(sourceId);
                  const targetPosition = nodePositions.get(targetId);
                  if (!source || !target || !sourcePosition || !targetPosition) return null;
                  const sourceX = sourcePosition.x + (source.group === 'outcome' ? 0 : nodeWidth);
                  const targetX = targetPosition.x;
                  const controlX = (sourceX + targetX) / 2;
                  const isSelected = selectedNodeId === sourceId || selectedNodeId === targetId;

                  return <path
                    key={`${sourceId}-${targetId}`}
                    d={`M ${sourceX} ${sourcePosition.y} C ${controlX} ${sourcePosition.y}, ${controlX} ${targetPosition.y}, ${targetX} ${targetPosition.y}`}
                    fill="none"
                    stroke={isSelected ? '#ff003c' : 'rgba(220,225,232,0.48)'}
                    strokeWidth={isSelected ? 2.5 : 2}
                    strokeDasharray="7 8"
                  />;
                })}
              </svg>
              {groupedNodes.flatMap((group) => group.nodes.map((node) => {
                const position = nodePositions.get(node.id);
                if (!position) return null;
                const selected = selectedNodeId === node.id;

                return <motion.button
                  key={node.id}
                  type="button"
                  initial={false}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedNodeId(selected ? null : node.id)}
                  aria-pressed={selected}
                  aria-haspopup="dialog"
                  aria-controls="system-map-node-detail"
                  className={`absolute z-10 min-h-[84px] -translate-y-1/2 border bg-[#111114]/95 p-3 text-left shadow-lg transition-colors ${selected ? 'border-[#FF003C] shadow-[0_0_20px_rgba(255,0,60,0.12)]' : groupStyles[node.group]}`}
                  style={{ left: `${position.x / chartWidth * 100}%`, top: `${position.y}px`, width: `${nodeWidth / chartWidth * 100}%` }}
                >
                  <span className={`block font-mono text-[8px] font-bold uppercase tracking-[0.16em] ${node.group === 'outcome' ? 'text-[#00DFC9]' : 'text-[#FF003C]'}`}>{group.label}</span>
                  <span className="mt-1 block text-sm font-bold leading-snug text-white">{node.title}</span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-white/55">{node.summary}</span>
                </motion.button>;
              }))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#08080a] p-4 md:hidden">
            {groupedNodes.map((group, groupIndex) => <React.Fragment key={group.id}>
              {!!group.nodes.length && <section aria-label={group.label}>
                <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">{group.label}</p>
                <div className="space-y-2">
                  {group.nodes.map((node) => <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(selectedNodeId === node.id ? null : node.id)}
                    aria-pressed={selectedNodeId === node.id}
                    aria-haspopup="dialog"
                    aria-controls="system-map-node-detail"
                    className={`w-full border bg-white/[0.025] p-3 text-left transition-colors ${selectedNodeId === node.id ? 'border-[#FF003C]' : groupStyles[node.id === 'output' ? 'outcome' : node.group]}`}
                  >
                    <span className="block text-sm font-bold text-white">{node.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/55">{node.summary}</span>
                  </button>)}
                </div>
              </section>}
              {groupIndex < groupedNodes.length - 1 && <div aria-hidden="true" className="flex justify-center py-2 text-[#FF003C]"><ArrowDown className="h-4 w-4" /></div>}
            </React.Fragment>)}
          </div>

          {selectedNode && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4" onClick={() => setSelectedNodeId(null)}>
            <section id="system-map-node-detail" role="dialog" aria-modal="true" aria-labelledby="system-map-node-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg border border-white/15 bg-[#101014] p-5 shadow-2xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#00DFC9]">{groups.find((group) => group.id === selectedNode.group)?.label} / NODE DETAIL</p>
                <button type="button" onClick={() => setSelectedNodeId(null)} aria-label="Close node details" className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 text-white/60 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <h3 id="system-map-node-title" className="mt-4 text-xl font-bold text-white">{selectedNode.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{selectedNode.detail}</p>
            </section>
          </div>}
        </div>
      </section>
    </MotionConfig>
  );
};