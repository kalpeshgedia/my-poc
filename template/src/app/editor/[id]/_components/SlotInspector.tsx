'use client';
import React, { useState } from 'react';
import { Poster } from '@/lib/mockData';
import { SLOT_META, TEXT_COLORS, AI_REWRITES } from '../_constants';
import { SlotStyle, FontId, TextSize, TextAlign } from '../_types';
import {
  IconTypeOn, IconSpark, IconAlignLeft, IconAlignCenter, IconAlignRight,
  IconChevronDown, IconTrash,
} from '../_icons';

const AI_TONE_OPTIONS = ['Formal', 'Warm', 'Bold', 'Simple'];

export default function SlotInspector({ slot, poster, style, onChange, onStyleChange, onRemove, onAIRewrite }: {
  slot: string; poster: Poster; style: SlotStyle;
  onChange: (field: string, val: string) => void;
  onStyleChange: (partial: Partial<SlotStyle>) => void;
  onRemove: () => void;
  onAIRewrite: (val: string) => void;
}) {
  const [aiLoading, setAILoading] = useState(false);
  const meta = SLOT_META[slot];
  if (!meta) return <div style={{ padding: 16, color: 'var(--ink-3)', fontSize: 13 }}>Click an editable element on the canvas.</div>;

  const val = (poster[meta.field] as string) || '';
  const lines = val ? val.split('\n').length : 1;
  const over = val.length > meta.maxChars;

  function handleAIRewrite(tone?: string) {
    setAILoading(true);
    const opts = AI_REWRITES[slot] || [val];
    const pick = opts[Math.floor(Date.now() % opts.length)];
    setTimeout(() => { setAILoading(false); onAIRewrite(pick); }, 1100);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Type on poster */}
      <button className="insp-type-row">
        <IconTypeOn /> Type on the poster
      </button>

      {/* Text field */}
      <div style={{ padding: '12px 14px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="insp-row-label">Text</div>
        {(meta.rows || 1) > 1 ? (
          <textarea
            rows={meta.rows}
            value={val}
            onChange={(e) => onChange(meta.field as string, e.target.value)}
            style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 8, padding: '8px 10px', fontSize: 13.5, lineHeight: 1.45, resize: 'vertical', fontFamily: 'inherit', background: 'var(--panel-2)', outline: 'none', boxSizing: 'border-box' }}
            autoFocus
          />
        ) : (
          <input type="text" value={val} onChange={(e) => onChange(meta.field as string, e.target.value)}
            style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 8, padding: '8px 10px', fontSize: 13.5, fontFamily: 'inherit', background: 'var(--panel-2)', outline: 'none', boxSizing: 'border-box' }}
            autoFocus />
        )}
        <div className="insp-char-row">
          <span style={{ color: over ? 'var(--bad)' : undefined }}>Characters {val.length}/{meta.maxChars}</span>
          {meta.rows && <span>Lines {lines}/{meta.rows}</span>}
        </div>
      </div>

      {/* AI rewrite box — matches HTML .ai-box */}
      <div style={{ padding: '4px 14px 10px' }}>
        <div className="ai-box">
          <div className="ai-head">
            <h4><IconSpark size={13} /> Rewrite with AI</h4>
            {aiLoading && <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Writing…</span>}
          </div>
          <div className="quick">
            {AI_TONE_OPTIONS.map((tone) => (
              <button key={tone} disabled={aiLoading} onClick={() => handleAIRewrite(tone)}>{tone}</button>
            ))}
          </div>
          <button
            className="btn primary sm"
            style={{ alignSelf: 'flex-start', gap: 5, fontSize: 12 }}
            onClick={() => handleAIRewrite()}
            disabled={aiLoading}
          >
            <IconSpark size={11} /> {aiLoading ? 'Rewriting…' : 'Rewrite'}
          </button>
        </div>
      </div>

      {/* Style section */}
      <div className="insp-style-head">STYLE</div>

      {meta.isText && (
        <>
          {/* Font */}
          <div className="insp-row">
            <div className="insp-row-label">Font</div>
            <div className="insp-seg">
              {([['instrument','Instrument'],['manrope','Manrope'],['fraunces','Fraunces']] as [FontId,string][]).map(([id, label]) => (
                <button key={id} aria-pressed={style.font === id} onClick={() => onStyleChange({ font: id })}
                  style={id === 'fraunces' ? { fontFamily: 'Georgia, serif' } : undefined}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Text size */}
          <div className="insp-row">
            <div className="insp-row-label">Text size</div>
            <div className="insp-seg">
              {(['small','medium','large'] as TextSize[]).map((s) => (
                <button key={s} aria-pressed={style.size === s} onClick={() => onStyleChange({ size: s })}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Alignment */}
          <div className="insp-row">
            <div className="insp-row-label">Alignment</div>
            <div className="insp-align-row">
              {([
                ['left',   <IconAlignLeft key="l"   />],
                ['center', <IconAlignCenter key="c" />],
                ['right',  <IconAlignRight key="r"  />],
              ] as [TextAlign, React.ReactNode][]).map(([a, icon]) => (
                <button key={a} className="insp-align-btn" aria-pressed={style.align === a} onClick={() => onStyleChange({ align: a })}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Text colour — circular swatches matching HTML */}
      <div className="insp-row">
        <div className="insp-row-label">Text colour</div>
        <div className="insp-colors">
          <button className="insp-swatch insp-swatch-auto" aria-pressed={style.color === 'auto'} title="Auto (template default)" onClick={() => onStyleChange({ color: 'auto' })}>Auto</button>
          {TEXT_COLORS.filter(c => c.id !== 'auto').map((c) => (
            <button key={c.id} className="insp-swatch" style={{ background: c.id }} aria-pressed={style.color === c.id} title={c.label} onClick={() => onStyleChange({ color: c.id })} />
          ))}
        </div>
      </div>

      {/* Position */}
      <details>
        <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', listStyle: 'none', padding: '12px 14px', borderBottom: '1px solid var(--line-2)', borderTop: '1px solid var(--line-2)' }}>
          Position <IconChevronDown />
        </summary>
        <div style={{ padding: '10px 14px', fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>
          Drag elements directly on the canvas to reposition them.
        </div>
      </details>

      {/* Remove */}
      <button className="insp-remove-btn" onClick={onRemove}>
        <IconTrash /> Remove from poster
      </button>
    </div>
  );
}
