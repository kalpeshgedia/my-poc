'use client';
import React from 'react';
import { IconEdit, IconLayers } from '@/components/ui/Icons';
import { InspTab } from '../_types';
import { IconShield, IconClock } from '../_icons';

export default function EditorRightRail({ inspOpen, inspTab, checksOk, handleRrailClick }: {
  inspOpen: boolean;
  inspTab: InspTab;
  checksOk: boolean;
  handleRrailClick: (tab: InspTab) => void;
}) {
  const rrailBtns: { id: InspTab; icon: React.ReactNode; label: string }[] = [
    { id: 'properties', icon: <IconEdit size={20} />, label: 'Properties' },
    { id: 'layers',     icon: <IconLayers size={20} />, label: 'Layers' },
    { id: 'checks',     icon: <IconShield size={20} />, label: 'Checks' },
    { id: 'history',    icon: <IconClock size={20} />, label: 'History' },
  ];

  return (
    <nav className="editor-rrail" aria-label="Panels">
      {rrailBtns.map((t) => (
        <button
          key={t.id}
          aria-pressed={inspOpen && inspTab === t.id}
          title={t.label}
          onClick={() => handleRrailClick(t.id)}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
      {!checksOk && (
        <span className="rbadge" style={{ position: 'relative', margin: '0 auto', background: 'var(--bad)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 8, marginTop: 2 }}>!</span>
      )}
    </nav>
  );
}
