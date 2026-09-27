'use client';
import PosterCanvas from '@/components/ui/PosterCanvas';
import { Poster } from '@/lib/mockData';
import { SLOT_META, EXTRA } from '../_constants';
import { InspTab, SlotStyle, ExtraElement } from '../_types';
import { IconX, IconSpark, IconTrash } from '../_icons';
import SlotInspector from './SlotInspector';
import LayersPanel from './LayersPanel';
import ChecksPanel from './ChecksPanel';
import HistoryPanel from './HistoryPanel';

const HERO_PHOTOS = [
  { key: 'couple',   label: 'Couple',   url: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400&q=80' },
  { key: 'toast',    label: 'Cheers',   url: 'https://images.unsplash.com/photo-1555685812-4b8f286d4b6c?w=400&q=80' },
  { key: 'dinner',   label: 'Dinner',   url: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&q=80' },
  { key: 'headshot', label: 'Portrait', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
];

interface EditorInspectorProps {
  inspTab: InspTab;
  setInspTab: (t: InspTab) => void;
  inspOpen: boolean;
  setInspOpen: (v: boolean) => void;
  selectedSlot: string | null;
  setSelectedSlot: (s: string | null) => void;
  selectedExtra: string | null;
  setSelectedExtra: (id: string | null) => void;
  extras: ExtraElement[];
  onRemoveExtra: (id: string) => void;
  onScaleExtra: (id: string, scale: number) => void;
  onRotateExtra: (id: string, rot: number) => void;
  poster: Poster;
  livePoster: Poster;
  name: string;
  headline: string;
  body: string;
  eyebrow: string;
  cta: string;
  sz: { label: string; w: number; h: number };
  getSlotStyle: (slot: string) => SlotStyle;
  updateSlotStyle: (slot: string, p: Partial<SlotStyle>) => void;
  handleFieldChange: (field: string, val: string) => void;
  heroImageKey: string;
  onHeroImageChange: (key: string) => void;
}

export default function EditorInspector({
  inspTab, setInspTab, inspOpen, setInspOpen,
  selectedSlot, setSelectedSlot,
  selectedExtra, setSelectedExtra,
  extras, onRemoveExtra, onScaleExtra, onRotateExtra,
  poster, livePoster, name, headline, body, eyebrow, cta, sz,
  getSlotStyle, updateSlotStyle, handleFieldChange,
  heroImageKey, onHeroImageChange,
}: EditorInspectorProps) {
  if (!inspOpen) return null;

  const slotLabel = selectedSlot ? (SLOT_META[selectedSlot]?.label || selectedSlot) : null;
  const activeExtra = selectedExtra ? extras.find((e) => e.id === selectedExtra) : null;
  const extraDef = activeExtra ? EXTRA[activeExtra.kind] : null;

  // Title for the inspector header
  let headTitle = 'Canvas';
  if (inspTab === 'layers') headTitle = 'Layers';
  else if (inspTab === 'checks') headTitle = 'Checks';
  else if (inspTab === 'history') headTitle = 'History';
  else if (activeExtra && extraDef) headTitle = extraDef.label;
  else if (selectedSlot === 'heroImage') headTitle = 'Photo';
  else if (slotLabel) headTitle = slotLabel;

  const showAIChip = inspTab === 'properties' && ((slotLabel && selectedSlot !== 'heroImage') || extraDef) ? true : false;

  return (
    <aside className="editor-insp" aria-labelledby="detTitle">
      {/* dhead: title + chip + close */}
      <div className="dhead">
        <h2 id="detTitle">{headTitle}</h2>
        {showAIChip && (
          <span className="chip ai"><IconSpark size={10} /> AI</span>
        )}
        <span style={{ flex: 1 }} />
        <button className="iconbtn sm ghosticon" onClick={() => setInspOpen(false)} title="Close (Esc)"><IconX /></button>
      </div>

      {/* Scrollable content */}
      <div className="insp-body" style={
        inspTab === 'properties' && selectedSlot && SLOT_META[selectedSlot] ? { padding: 0, gap: 0 } : undefined
      }>

        {/* ── Hero image photo picker ── */}
        {inspTab === 'properties' && selectedSlot === 'heroImage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              <b style={{ display: 'block', fontSize: 13, color: 'var(--ink)', marginBottom: 4 }}>Hero photo</b>
              Choose the photo that appears in the hero area of the poster.
            </div>
            <div className="libgrid">
              {HERO_PHOTOS.map((p) => (
                <button
                  key={p.key}
                  aria-pressed={heroImageKey === p.key}
                  onClick={() => onHeroImageChange(p.key)}
                >
                  <img src={p.url} alt={p.label} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Slot inspector ── */}
        {inspTab === 'properties' && selectedSlot && SLOT_META[selectedSlot] && (
          <SlotInspector
            slot={selectedSlot}
            poster={livePoster}
            style={getSlotStyle(selectedSlot)}
            onChange={handleFieldChange}
            onStyleChange={(p) => updateSlotStyle(selectedSlot, p)}
            onRemove={() => { handleFieldChange(selectedSlot, ''); setSelectedSlot(null); }}
            onAIRewrite={(val) => handleFieldChange(selectedSlot, val)}
          />
        )}

        {/* ── Extra element inspector ── */}
        {inspTab === 'properties' && activeExtra && extraDef && !selectedSlot && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              <b style={{ display: 'block', fontSize: 13, color: 'var(--ink)' }}>{extraDef.label}</b>
              <span>{extraDef.hint}</span>
            </div>

            {/* Size slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Size</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{Math.round((activeExtra.scale || 1) * 100)}%</span>
              </label>
              <input
                type="range"
                min="40"
                max="300"
                step="5"
                value={Math.round((activeExtra.scale || 1) * 100)}
                onChange={(e) => onScaleExtra(activeExtra.id, Number(e.target.value) / 100)}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            {/* Rotation slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Rotation</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{activeExtra.rot || 0}°</span>
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={activeExtra.rot || 0}
                onChange={(e) => onRotateExtra(activeExtra.id, Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            <button
              style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--bad)', background: 'transparent', border: 0, padding: '8px 0', fontSize: 13, cursor: 'pointer', fontWeight: 500, textAlign: 'left' }}
              onClick={() => { onRemoveExtra(activeExtra.id); setSelectedExtra(null); }}
            >
              <IconTrash /> Remove from poster
            </button>
          </div>
        )}

        {/* ── Canvas overview (nothing selected) ── */}
        {inspTab === 'properties' && !selectedSlot && !activeExtra && (
          <div className="sec">
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              <b style={{ display: 'block', fontSize: 14 }}>{name}</b>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>{sz.label} · {sz.w}×{sz.h}</span>
            </div>
            <div style={{ borderRadius: 9, overflow: 'hidden', border: '1px solid var(--line)', width: '100%', height: 150, background: 'var(--line-2)', display: 'grid', placeItems: 'center' }}>
              <PosterCanvas poster={livePoster} scale={Math.min(130 / sz.w, 140 / sz.h)} />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>Click any text on the canvas to edit it.</p>
            <div className="sec">
              <h2 className="insp-label">All fields</h2>
              {[
                { slot: 'eyebrow',  label: 'Eyebrow',  val: eyebrow },
                { slot: 'headline', label: 'Headline', val: headline },
                ...(poster.body !== undefined ? [{ slot: 'body', label: 'Body',  val: body }] : []),
                ...(poster.cta  !== undefined ? [{ slot: 'cta',  label: 'CTA',   val: cta  }] : []),
              ].map((f) => (
                <button key={f.slot} onClick={() => setSelectedSlot(f.slot)} style={{
                  display: 'flex', alignItems: 'baseline', gap: 8, border: '1px solid var(--line)',
                  background: selectedSlot === f.slot ? 'var(--accent-soft)' : 'var(--panel-2)',
                  borderColor: selectedSlot === f.slot ? 'var(--accent)' : 'var(--line)',
                  borderRadius: 8, padding: '8px 10px', cursor: 'pointer', textAlign: 'left', width: '100%',
                }}>
                  <span style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--mono)', minWidth: 52, flexShrink: 0 }}>{f.label}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{f.val || '—'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {inspTab === 'layers' && (
          <LayersPanel
            selectedSlot={selectedSlot}
            selectedExtra={selectedExtra}
            eyebrow={eyebrow} headline={headline} body={body} cta={cta}
            extras={extras}
            onSelect={(s) => { setSelectedSlot(s); setSelectedExtra(null); setInspTab('properties'); }}
            onSelectExtra={(id) => { setSelectedExtra(id); setSelectedSlot(null); setInspTab('properties'); }}
          />
        )}
        {inspTab === 'checks' && <ChecksPanel poster={livePoster} />}
        {inspTab === 'history' && <HistoryPanel poster={poster} />}
      </div>
    </aside>
  );
}
