'use client';
import { useRef } from 'react';
import { ExtraElement } from '../_types';
import { EXTRA } from '../_constants';

// Render a simplified visual for each extra kind, scaled with the canvas
function ExtraVisual({ kind, scale }: { kind: string; scale: number }) {
  const u = scale;
  const s = (v: number) => Math.round(v * u);
  const accent = '#D31145';

  switch (kind) {
    case 'heading':
      return <div style={{ fontSize: s(28), fontWeight: 800, fontFamily: 'Georgia,serif', color: accent, lineHeight: 1.1, padding: `${s(6)}px ${s(8)}px`, background: 'rgba(255,255,255,.92)', borderRadius: s(6) }}>Heading</div>;
    case 'text':
      return <div style={{ fontSize: s(14), color: '#1F2A37', lineHeight: 1.4, padding: `${s(6)}px ${s(8)}px`, background: 'rgba(255,255,255,.92)', borderRadius: s(6), maxWidth: s(200) }}>Text box</div>;
    case 'checklist':
      return <div style={{ fontSize: s(12), display: 'flex', flexDirection: 'column', gap: s(4), padding: `${s(8)}px ${s(10)}px`, background: 'rgba(255,255,255,.95)', borderRadius: s(8), minWidth: s(140) }}>
        {['Point one', 'Point two', 'Point three'].map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: s(6), alignItems: 'center' }}>
            <span style={{ width: s(14), height: s(14), borderRadius: '50%', background: accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width={s(9)} height={s(9)} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
            </span>
            <span style={{ color: '#1F2A37', fontWeight: 600 }}>{t}</span>
          </div>
        ))}
      </div>;
    case 'callout':
      return <div style={{ fontSize: s(12), lineHeight: 1.4, padding: `${s(8)}px ${s(12)}px`, background: '#FCE8EE', borderLeft: `${s(4)}px solid ${accent}`, borderRadius: s(6), maxWidth: s(200) }}>
        <b style={{ display: 'block', color: accent, marginBottom: s(2) }}>Did you know?</b>
        <span style={{ color: '#1F2A37' }}>A cover review takes about 30 minutes.</span>
      </div>;
    case 'stat':
      return <div style={{ textAlign: 'center', padding: `${s(8)}px ${s(14)}px`, background: 'rgba(255,255,255,.95)', borderRadius: s(8), boxShadow: `0 ${s(4)}px ${s(14)}px rgba(31,42,55,.2)` }}>
        <div style={{ fontSize: s(36), fontWeight: 800, color: accent, lineHeight: 1 }}>30</div>
        <div style={{ fontSize: s(11), color: '#5B6472', marginTop: s(2) }}>minutes for a review</div>
      </div>;
    case 'signature':
      return <div style={{ fontSize: s(22), fontFamily: 'Georgia,cursive', fontStyle: 'italic', color: accent, padding: `${s(4)}px ${s(8)}px` }}>Warm wishes, Jane</div>;
    case 'event':
      return <div style={{ fontSize: s(11), display: 'flex', flexDirection: 'column', gap: s(3), padding: `${s(8)}px ${s(10)}px`, background: 'rgba(255,255,255,.95)', borderRadius: s(8), border: `1px solid #e0e0e8`, minWidth: s(160) }}>
        <div style={{ fontWeight: 700, color: '#1F2A37' }}>📅 Event Details</div>
        <div style={{ color: '#5B6472' }}>17 Oct 2026 · 2.00pm</div>
        <div style={{ color: '#5B6472' }}>Level 3, Horizon Hall</div>
      </div>;
    case 'datebadge':
      return <div style={{ width: s(56), height: s(64), borderRadius: s(8), background: accent, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: s(2) }}>
        <div style={{ fontSize: s(26), fontWeight: 800, lineHeight: 1 }}>17</div>
        <div style={{ fontSize: s(10), fontWeight: 700, letterSpacing: '0.1em' }}>OCT</div>
      </div>;
    case 'agenda':
      return <div style={{ fontSize: s(11), display: 'flex', flexDirection: 'column', gap: s(3), padding: `${s(8)}px ${s(10)}px`, background: 'rgba(255,255,255,.95)', borderRadius: s(8), minWidth: s(170) }}>
        {[['2.00pm', 'Registration'], ['2.30pm', 'Main talk'], ['4.00pm', 'Q&A']].map(([t, l], i) => (
          <div key={i} style={{ display: 'flex', gap: s(8) }}>
            <span style={{ color: accent, fontFamily: 'var(--mono)', minWidth: s(40), fontWeight: 700 }}>{t}</span>
            <span style={{ color: '#1F2A37' }}>{l}</span>
          </div>
        ))}
      </div>;
    case 'speaker':
      return <div style={{ display: 'flex', gap: s(8), alignItems: 'center', padding: `${s(8)}px ${s(10)}px`, background: 'rgba(255,255,255,.95)', borderRadius: s(8), minWidth: s(150) }}>
        <span style={{ width: s(32), height: s(32), borderRadius: '50%', background: '#d0d0e0', boxShadow: `0 0 0 ${s(2)}px ${accent}`, flexShrink: 0, display: 'block' }} />
        <div style={{ fontSize: s(11) }}>
          <div style={{ fontWeight: 700, color: '#1F2A37' }}>Lim Mei Hua</div>
          <div style={{ color: '#5B6472' }}>Guest speaker</div>
        </div>
      </div>;
    case 'qr':
      return <div style={{ padding: s(8), background: '#fff', borderRadius: s(8), border: '1px solid #e0e0e8' }}>
        <svg viewBox="0 0 24 24" width={s(48)} height={s(48)} fill="#1F2A37">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM5 5v3h3V5zM16 5v3h3V5zM5 16v3h3v-3z" fillRule="evenodd"/>
        </svg>
        <div style={{ fontSize: s(9), color: '#5B6472', textAlign: 'center', marginTop: s(2) }}>Scan to register</div>
      </div>;
    case 'adviser':
      return <div style={{ display: 'flex', gap: s(8), alignItems: 'center', padding: `${s(8)}px ${s(12)}px`, background: 'rgba(255,255,255,.95)', borderRadius: s(8), border: `1px solid #e0e0e8`, minWidth: s(160) }}>
        <span style={{ width: s(32), height: s(32), borderRadius: '50%', background: accent, color: '#fff', display: 'grid', placeItems: 'center', fontSize: s(11), fontWeight: 700, flexShrink: 0 }}>JT</span>
        <div style={{ fontSize: s(11) }}>
          <div style={{ fontWeight: 700, color: '#1F2A37' }}>Jane Tan</div>
          <div style={{ color: '#5B6472' }}>Financial Consultant</div>
        </div>
      </div>;
    case 'contact':
      return <div style={{ display: 'flex', gap: s(6), alignItems: 'center', padding: `${s(7)}px ${s(12)}px`, background: accent, borderRadius: s(6), color: '#fff' }}>
        <svg viewBox="0 0 24 24" width={s(13)} height={s(13)} fill="#fff"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
        <span style={{ fontSize: s(12), fontWeight: 600 }}>WhatsApp me</span>
      </div>;
    case 'badge':
      return <div style={{ display: 'inline-block', padding: `${s(4)}px ${s(12)}px`, borderRadius: s(18), background: '#FF6B4A', color: '#fff', fontSize: s(13), fontWeight: 800, transform: 'rotate(-6deg)' }}>NEW</div>;
    case 'sticker':
      return <div style={{ position: 'relative', width: s(64), height: s(64), display: 'grid', placeItems: 'center' }}>
        <svg viewBox="0 0 100 100" width={s(64)} height={s(64)} fill="#FFB627"><polygon points="50,5 61,35 95,35 67,57 78,91 50,70 22,91 33,57 5,35 39,35"/></svg>
        <span style={{ position: 'absolute', fontSize: s(9), fontWeight: 700, color: '#1F2A37', textAlign: 'center', lineHeight: 1.2 }}>A few words</span>
      </div>;
    case 'ribbon':
      return <div style={{ position: 'relative', width: s(60), height: s(60), overflow: 'hidden', borderRadius: s(4) }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: s(70), height: s(70), background: accent, transform: 'rotate(45deg) translate(50%, -70%)' }} />
        <span style={{ position: 'absolute', top: s(6), right: s(4), fontSize: s(8), color: '#fff', fontWeight: 700, transform: 'rotate(45deg)' }}>New</span>
      </div>;
    case 'icon':
      return <svg viewBox="0 0 24 24" width={s(36)} height={s(36)} fill={accent}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
    case 'line':
      return <div style={{ width: s(180), height: s(4), borderRadius: s(2), background: accent }} />;
    case 'frame':
      return <div style={{ width: s(120), height: s(160), border: `${s(4)}px solid ${accent}`, borderRadius: s(6), background: 'transparent', opacity: 0.7 }} />;
    case 'rect':
      return <div style={{ width: s(140), height: s(80), borderRadius: s(10), background: 'linear-gradient(135deg,#0FA3B1,#3D8BFD)', opacity: 0.85 }} />;
    case 'circle':
      return <div style={{ width: s(80), height: s(80), borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B4A,#FFB627)', opacity: 0.85 }} />;
    case 'arrow':
      return <svg viewBox="0 0 100 40" width={s(80)} height={s(32)} fill="#FFB627">
        <path d="M4 26c20-9 44-12 66-8" fill="none" stroke="#FFB627" strokeWidth="7" strokeLinecap="round"/>
        <path d="M64 7 94 18 67 33Z"/>
      </svg>;
    case 'photo':
      return <div style={{ width: s(72), height: s(72), borderRadius: '50%', background: 'linear-gradient(135deg,#d0d0e0,#b0b0c0)', border: `${s(3)}px solid #fff`, boxShadow: `0 0 0 ${s(2)}px #ccc` }} />;
    default:
      return <div style={{ padding: `${s(8)}px ${s(12)}px`, background: 'rgba(255,255,255,.9)', borderRadius: s(6), fontSize: s(12), color: accent, fontWeight: 700 }}>{EXTRA[kind]?.label || kind}</div>;
  }
}

interface Props {
  extras: ExtraElement[];
  selectedExtra: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  scale: number;
}

interface DraggableProps {
  ex: ExtraElement;
  selectedExtra: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  scale: number;
}

function DraggableExtra({ ex, selectedExtra, onSelect, onMove, scale }: DraggableProps) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect(ex.id);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: ex.x,
      origY: ex.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) / scale;
    const dy = (e.clientY - dragRef.current.startY) / scale;
    const newX = Math.max(0, dragRef.current.origX + dx);
    const newY = Math.max(0, dragRef.current.origY + dy);
    onMove(ex.id, newX, newY);
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: ex.x * scale,
        top: ex.y * scale,
        transform: `scale(${ex.scale || 1}) rotate(${ex.rot || 0}deg)`,
        transformOrigin: 'top left',
        cursor: 'grab',
        zIndex: 5,
        outline: selectedExtra === ex.id ? `2px solid #D31145` : undefined,
        outlineOffset: 3,
        borderRadius: 6,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      title={EXTRA[ex.kind]?.label || ex.kind}
    >
      <ExtraVisual kind={ex.kind} scale={scale} />
    </div>
  );
}

export default function ExtrasOverlay({ extras, selectedExtra, onSelect, onMove, scale }: Props) {
  if (!extras.length) return null;

  return (
    <>
      {extras.map((ex) => (
        <DraggableExtra
          key={ex.id}
          ex={ex}
          selectedExtra={selectedExtra}
          onSelect={onSelect}
          onMove={onMove}
          scale={scale}
        />
      ))}
    </>
  );
}
