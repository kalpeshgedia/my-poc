'use client';
import Link from 'next/link';
import { Poster, SIZES, STATUS_LABELS } from '@/lib/mockData';
import { IconBack, IconCheck, IconEye, IconSend, IconMore, IconChevDown } from '@/components/ui/Icons';
import { InspTab } from '../_types';
import { IconUndo, IconRedo, IconX, IconTrash, IconClock } from '../_icons';

interface EditorTopBarProps {
  name: string;
  onNameChange: (v: string) => void;
  poster: Poster;
  sz: { label: string; w: number; h: number };
  checksOk: boolean;
  saved: boolean;
  showMoreMenu: boolean;
  setShowMoreMenu: (v: boolean) => void;
  showSizeMenu: boolean;
  setShowSizeMenu: (v: boolean) => void;
  onPreview: () => void;
  onShare: () => void;
  onSubmit: () => void;
  onChecksClick: () => void;
  handleRrailClick: (tab: InspTab) => void;
  showToast: (msg: string) => void;
  livePoster: Poster;
}

export default function EditorTopBar({
  name, onNameChange, poster, sz, checksOk, saved,
  showMoreMenu, setShowMoreMenu, showSizeMenu, setShowSizeMenu,
  onPreview, onShare, onSubmit, onChecksClick,
  handleRrailClick, showToast,
}: EditorTopBarProps) {
  const canSubmit = poster.status === 'draft' || poster.status === 'review';
  const canShare  = poster.status === 'approved';

  return (
    <header className="editor-top">
      <Link href="/posters" className="iconbtn ghosticon" style={{ textDecoration: 'none' }} title="Back to My posters">
        <IconBack size={18} />
      </Link>
      <img src="/aia-mark.svg" className="glyphimg" alt="AIA" width="28" height="28" style={{ display: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <input className="ptitle-input" value={name} onChange={(e) => onNameChange(e.target.value)} aria-label="Poster name" />
        <span className={`status ${poster.status}`}><span className="dot" />{STATUS_LABELS[poster.status]}</span>
        <span style={{ fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{saved ? 'Saved' : 'Saving…'}</span>
      </div>

      <button className={`checkchip ${checksOk ? 'ok' : 'bad'}`} onClick={onChecksClick} title="Compliance checks">
        <span className="dot" />{checksOk ? 'Checks pass' : 'Issues found'}
      </button>
      <span className="protobadge hide-md" title="Design prototype for discussion.">Prototype</span>
      <div style={{ flex: 1 }} />

      <div style={{ position: 'relative' }}>
        <button className="btn ghost sizebtn hide-sm" style={{ gap: 5, fontSize: 12.5 }} title="Output size" onClick={() => { setShowSizeMenu(!showSizeMenu); setShowMoreMenu(false); }}>
          {sz.label} <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>{sz.w}×{sz.h}</span> <IconChevDown size={13} />
        </button>
        {showSizeMenu && (
          <div className="pop-menu" style={{ minWidth: 220 }}>
            {([
              ['1080x1350', 'Portrait',  '1080×1350', 'Best for WhatsApp, Instagram'],
              ['1080x1080', 'Square',    '1080×1080', 'Instagram feed, Facebook'],
              ['1200x628',  'Landscape', '1200×628',  'LinkedIn, email headers'],
              ['1080x1920', 'Story',     '1080×1920', 'Instagram Stories, full screen'],
            ] as [string, string, string, string][]).map(([k, label, dim, desc]) => (
              <button key={k} className="pop-item" aria-pressed={poster.size === k} onClick={() => { showToast(`Resizing to ${label} (${dim}) — simulated.`); setShowSizeMenu(false); }}>
                <b>{label}</b>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', marginLeft: 'auto', marginRight: 8 }}>{dim}</span>
                <small style={{ display: 'block', fontSize: 11, color: 'var(--ink-3)', fontWeight: 400 }}>{desc}</small>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="undogrp hide-sm" style={{ display: 'flex', gap: 2 }}>
        <button className="iconbtn ghosticon" title="Undo (Ctrl+Z)" disabled><IconUndo /></button>
        <button className="iconbtn ghosticon" title="Redo" disabled><IconRedo /></button>
      </div>

      <button className="btn hide-sm" onClick={onPreview}>
        <IconEye size={13} /> Preview
      </button>

      {canShare ? (
        <button className="btn primary" onClick={onShare}>
          <IconSend size={13} /> Share
        </button>
      ) : canSubmit ? (
        <button className="btn primary" onClick={onSubmit}>
          <IconCheck size={13} /> Submit for review
        </button>
      ) : (
        <button className="btn" disabled><IconEye size={13} /> View only</button>
      )}

      <div style={{ position: 'relative' }}>
        <button className="iconbtn" title="More options" onClick={() => { setShowMoreMenu(!showMoreMenu); setShowSizeMenu(false); }}><IconMore size={14} /></button>
        {showMoreMenu && (
          <div className="pop-menu" style={{ right: 0, left: 'auto', minWidth: 210 }}>
            <button className="pop-item" onClick={() => { onPreview(); setShowMoreMenu(false); }}><IconEye size={14} /> Preview</button>
            <button className="pop-item" onClick={() => { setShowSizeMenu(true); setShowMoreMenu(false); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Output size
            </button>
            <button className="pop-item" onClick={() => { showToast('Downloading draft PNG (simulated).'); setShowMoreMenu(false); }}><IconChevDown size={14} /> Download draft</button>
            <div className="pop-divider" />
            <button className="pop-item" onClick={() => { showToast(`"${name}" duplicated (simulated).`); setShowMoreMenu(false); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Duplicate
            </button>
            <button className="pop-item" onClick={() => { handleRrailClick('history'); setShowMoreMenu(false); }}><IconClock size={14} /> Version history</button>
            <div className="pop-divider" />
            <button className="pop-item danger" onClick={() => { showToast('Delete poster (simulated).'); setShowMoreMenu(false); }}>
              <IconTrash /> Delete poster
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
