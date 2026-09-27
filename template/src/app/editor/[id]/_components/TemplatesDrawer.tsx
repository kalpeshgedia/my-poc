'use client';
import { Poster, TPL_MAP } from '@/lib/mockData';
import { IconX } from '../_icons';

export default function TemplatesDrawer({ poster, onClose }: { poster: Poster; onClose: () => void }) {
  const tpl = TPL_MAP[poster.templateId];
  const catTpls = Object.values(TPL_MAP).filter((t) => t.cat === tpl?.cat);
  return (
    <>
      <div className="editor-ldrawer-head">
        <h2>Templates</h2>
        <button className="iconbtn sm ghosticon" onClick={onClose}><IconX /></button>
      </div>
      <div className="editor-ldrawer-scroll">
        <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>AIA Singapore brand pack. Your text carries over when you switch.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {catTpls.map((t) => (
            <button key={t.id} className="tplc" aria-pressed={poster.templateId === t.id ? 'true' : 'false'} style={{ textAlign: 'left' }}>
              <div className="tt" style={{ height: 90, background: t.bg || '#f0f0f0', borderRadius: 6, display: 'grid', placeItems: 'center', fontSize: 8, fontWeight: 700, color: t.accentColor || '#D31145' }}>{t.name}</div>
              <b>{t.name}</b>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
