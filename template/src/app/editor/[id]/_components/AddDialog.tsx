'use client';
import { KIT_GROUPS, EXTRA, MAX_EXTRAS } from '../_constants';
import { ExtraElement } from '../_types';
import { IconX } from '../_icons';

// ── Per-kind icon glyphs matching HTML's kitGlyph / kitGlyph2 ────────────────
function KitIcon({ kind }: { kind: string }) {
  const s = { width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--panel-2)', display: 'grid', placeItems: 'center', flexShrink: 0 } as const;
  switch (kind) {
    case 'heading':
      return <span style={s}><b style={{ fontFamily: 'Georgia,serif', fontSize: 15 }}>Aa</b></span>;
    case 'text':
      return <span style={s}><b style={{ fontSize: 13 }}>T</b></span>;
    case 'checklist':
      return <span style={s}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#D31145" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7l2 2 3-3M4 14l2 2 3-3M12 8h8M12 15h8"/>
        </svg>
      </span>;
    case 'callout':
      return <span style={{ ...s, overflow: 'hidden' }}>
        <span style={{ width: 20, height: 14, borderRadius: 3, background: '#FCE8EE', borderLeft: '3px solid #D31145', display: 'block' }} />
      </span>;
    case 'stat':
      return <span style={s}><b style={{ fontSize: 13, color: '#D31145' }}>40</b></span>;
    case 'signature':
      return <span style={s}><b style={{ fontFamily: 'Georgia,cursive', fontSize: 16, color: '#D31145', fontStyle: 'italic' }}>Jt</b></span>;
    case 'event':
      return <span style={s}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="#1F2A37">
          <rect x="3" y="4" width="18" height="17" rx="2" fill="none" stroke="#1F2A37" strokeWidth="1.8"/>
          <path d="M3 9h18M8 2v4M16 2v4" stroke="#1F2A37" strokeWidth="1.8" strokeLinecap="round"/>
          <rect x="7" y="12" width="3" height="3" rx="0.5" fill="#D31145"/>
        </svg>
      </span>;
    case 'datebadge':
      return <span style={s}>
        <span style={{ width: 18, height: 20, borderRadius: 4, background: '#D31145', color: '#fff', fontSize: 9, fontWeight: 800, display: 'grid', placeItems: 'center' }}>17</span>
      </span>;
    case 'agenda':
      return <span style={s}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#1F2A37" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h3M4 12h3M4 18h3M10 6h10M10 12h10M10 18h10"/>
        </svg>
      </span>;
    case 'speaker':
      return <span style={s}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#e0e0e8', boxShadow: '0 0 0 2px #D31145', display: 'block' }} />
      </span>;
    case 'qr':
      return <span style={s}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="#1F2A37">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM5 5v3h3V5zM16 5v3h3V5zM5 16v3h3v-3z" fillRule="evenodd"/>
        </svg>
      </span>;
    case 'adviser':
      return <span style={s}><b style={{ fontSize: 10 }}>JT</b></span>;
    case 'contact':
      return <span style={s}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="#D31145">
          <path d="M4 4h16v11H9l-5 4Z"/>
        </svg>
      </span>;
    case 'badge':
      return <span style={s}>
        <span style={{ display: 'inline-block', padding: '2px 6px', borderRadius: 9, background: '#FF6B4A', color: '#fff', fontSize: 8, fontWeight: 800, transform: 'rotate(-6deg)' }}>NEW</span>
      </span>;
    case 'sticker':
      return <span style={s}>
        <svg viewBox="0 0 100 100" width="18" height="18" fill="#FFB627">
          <polygon points="50,5 61,35 95,35 67,57 78,91 50,70 22,91 33,57 5,35 39,35"/>
        </svg>
      </span>;
    case 'ribbon':
      return <span style={{ ...s, overflow: 'hidden', position: 'relative' }}>
        <span style={{ width: 24, height: 7, background: '#D31145', transform: 'rotate(35deg)', display: 'block' }} />
      </span>;
    case 'icon':
      return <span style={s}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#D31145">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </span>;
    case 'line':
      return <span style={s}>
        <span style={{ width: 22, height: 3, borderRadius: 2, background: '#E2552C', display: 'block' }} />
      </span>;
    case 'frame':
      return <span style={s}>
        <span style={{ width: 18, height: 22, border: '2px dashed #D31145', borderRadius: 3, display: 'block' }} />
      </span>;
    case 'rect':
      return <span style={s}>
        <span style={{ width: 22, height: 14, borderRadius: 4, background: 'linear-gradient(135deg,#0FA3B1,#3D8BFD)', display: 'block' }} />
      </span>;
    case 'circle':
      return <span style={s}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B4A,#FFB627)', display: 'block' }} />
      </span>;
    case 'arrow':
      return <span style={s}>
        <svg viewBox="0 0 100 40" width="22" height="10" fill="#FFB627">
          <path d="M4 26c20-9 44-12 66-8" fill="none" stroke="#FFB627" strokeWidth="7" strokeLinecap="round"/>
          <path d="M64 7 94 18 67 33Z"/>
        </svg>
      </span>;
    case 'photo':
      return <span style={s}>
        <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 0 1px #ccc', background: 'linear-gradient(135deg,#d0d0e0,#b0b0c0)', display: 'block' }} />
      </span>;
    default:
      return <span style={s}><span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{kind.slice(0, 2).toUpperCase()}</span></span>;
  }
}

interface Props {
  extras: ExtraElement[];
  onClose: () => void;
  onAdd: (kind: string) => void;
}

export default function AddDialog({ extras, onClose, onAdd }: Props) {
  const count = extras.length;
  const full = count >= MAX_EXTRAS;

  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal add-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Add to poster"
        style={{ width: 'min(600px, calc(100vw - 16px))', maxHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line)', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, flex: 1 }}>Add to poster</h3>
          <button className="iconbtn ghosticon" onClick={onClose} aria-label="Close"><IconX /></button>
        </header>

        {/* Kit list — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 6 }}>
          <div className="add-kitlist">
            {KIT_GROUPS.map(([group, kinds]) => (
              <div key={group}>
                <div className="add-mgroup">{group}</div>
                <div className="add-kitgrid">
                  {kinds.map((kind) => {
                    const d = EXTRA[kind];
                    return (
                      <button
                        key={kind}
                        className="add-kitbtn"
                        disabled={full}
                        title={d.hint}
                        onClick={() => { onAdd(kind); onClose(); }}
                      >
                        <KitIcon kind={kind} />
                        <span>
                          <b>{d.label}</b>
                          <small>{d.hint}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="add-dialog-foot">
          {full
            ? `This poster already has ${MAX_EXTRAS} added elements. Remove one to add another.`
            : `${count} of ${MAX_EXTRAS} added. Nothing may cover the logo or disclaimer.`}
        </div>
      </div>
    </div>
  );
}
