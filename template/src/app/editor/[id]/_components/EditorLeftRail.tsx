'use client';
import { IconLayers } from '@/components/ui/Icons';
import { LeftPanel, InspTab } from '../_types';
import { IconTemplates, IconShield } from '../_icons';

export default function EditorLeftRail({ leftPanel, setLeftPanel, inspOpen, inspTab, checksOk, handleRrailClick, onOpenAdd }: {
  leftPanel: LeftPanel;
  setLeftPanel: (v: LeftPanel) => void;
  inspOpen: boolean;
  inspTab: InspTab;
  checksOk: boolean;
  handleRrailClick: (tab: InspTab) => void;
  onOpenAdd: () => void;
}) {
  return (
    <nav className="editor-rail" aria-label="Editor tools">
      <button
        aria-pressed={leftPanel === 'templates'}
        title="Templates"
        onClick={() => setLeftPanel(leftPanel === 'templates' ? null : 'templates')}
      >
        <IconTemplates />
        Templates
      </button>
      <button
        title="Add to poster (A)"
        onClick={onOpenAdd}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        Add
      </button>
      <button
        aria-pressed={inspOpen && inspTab === 'layers'}
        title="Layers"
        onClick={() => handleRrailClick('layers')}
      >
        <IconLayers size={20} />
        Layers
      </button>
      <button
        aria-pressed={inspOpen && inspTab === 'checks'}
        title={!checksOk ? `${checksOk ? '' : 'Issues found'} — Checks` : 'Checks'}
        onClick={() => handleRrailClick('checks')}
        style={{ position: 'relative' }}
      >
        <IconShield size={20} />
        Checks
        {!checksOk && <span className="rbadge">!</span>}
      </button>
    </nav>
  );
}
