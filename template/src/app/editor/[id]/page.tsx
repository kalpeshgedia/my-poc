'use client';
import React, { useState, useEffect, useRef, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PosterCanvas from '@/components/ui/PosterCanvas';
import { useApp } from '@/lib/store';
import { Poster, SIZES, STATUS_LABELS, relTime, TPL_MAP } from '@/lib/mockData';
import {
  IconBack, IconCheck, IconEye, IconSend, IconEdit, IconMore,
  IconLayers, IconChevDown,
} from '@/components/ui/Icons';

// ─── Icons specific to editor rail ────────────────────────────────────────────
function IconTemplates() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3" y="3" width="8" height="11" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="11" width="8" height="7" rx="1.5"/><rect x="3" y="17" width="8" height="4" rx="1.5"/></svg>;
}
function IconShield() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6Z"/></svg>;
}
function IconHistory() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
}
function IconSpark() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c.4 3.9 1.9 6.4 6.9 7.6-5 1.2-6.5 3.7-6.9 7.6-.4-3.9-1.9-6.4-6.9-7.6 5-1.2 6.5-3.7 6.9-7.6Z"/><path d="M19 15.5c.2 1.8.9 2.9 3 3.4-2.1.5-2.8 1.6-3 3.4-.2-1.8-.9-2.9-3-3.4 2.1-.5 2.8-1.6 3-3.4Z"/></svg>;
}
function IconUndo() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>;
}
function IconRedo() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/></svg>;
}
function IconX() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>;
}
function IconPlus2() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;
}

type RailTab = 'templates' | 'layers' | 'checks' | 'history' | null;
type InspTab = 'properties' | 'checks' | 'history';

// ─── SHARE MODAL ──────────────────────────────────────────────────────────────
function ShareModal({ poster, onClose, onShared }: { poster: Poster; onClose: () => void; onShared: () => void }) {
  const [channel, setChannel] = useState<string>('whatsapp');
  const [sending, setSending] = useState(false);
  const channels = [
    { id: 'whatsapp', emoji: '💬', label: 'WhatsApp', desc: 'Send directly to clients' },
    { id: 'instagram', emoji: '📸', label: 'Instagram', desc: 'Post or Story' },
    { id: 'facebook', emoji: '👍', label: 'Facebook', desc: 'Post or Messenger' },
    { id: 'linkedin', emoji: '💼', label: 'LinkedIn', desc: 'Professional network' },
    { id: 'download', emoji: '⬇️', label: 'Download PNG', desc: 'Save to device' },
  ];
  function handleShare() {
    setSending(true);
    setTimeout(() => { setSending(false); onShared(); onClose(); }, 1400);
  }
  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal share-modal" role="dialog" aria-modal="true">
        <header>
          <h3>Share "{poster.name}"</h3>
          <button className="iconbtn ghosticon" onClick={onClose}><IconX /></button>
        </header>
        <div className="share-modal mbody">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)' }}>This poster is approved. Choose where to share it.</p>
          {channels.map((c) => (
            <button key={c.id} className="share-channel" aria-pressed={channel === c.id} onClick={() => setChannel(c.id)}>
              <div className="sc-ico">{c.emoji}</div>
              <div>
                <b>{c.label}</b>
                <small>{c.desc}</small>
              </div>
              {channel === c.id && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}><IconCheck /></span>}
            </button>
          ))}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={handleShare} disabled={sending}>
              {sending ? 'Sharing…' : <><IconSend size={13} /> Share via {channels.find(c => c.id === channel)?.label}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKS PANEL ─────────────────────────────────────────────────────────────
function ChecksPanel({ poster }: { poster: Poster }) {
  const checks = [
    { ok: (poster.headline?.length || 0) <= 48, label: 'Headline length', detail: `${poster.headline?.length || 0} / 48 chars` },
    { ok: (poster.body?.length || 0) <= 120, label: 'Body copy length', detail: `${poster.body?.length || 0} / 120 chars` },
    { ok: !poster.headline?.toLowerCase().includes('guaranteed'), label: 'No restricted words', detail: 'Headline and body checked' },
    { ok: poster.status !== 'draft' || true, label: 'Disclaimer present', detail: 'MAS-required text included' },
  ];
  const allOk = checks.every((c) => c.ok);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className={`check-head ${allOk ? 'ok' : 'bad'}`}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: allOk ? 'var(--ok)' : 'var(--bad)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          {allOk ? <IconCheck size={14} /> : <span style={{ fontSize: 13, fontWeight: 800 }}>!</span>}
        </span>
        <div>
          <b>{allOk ? 'Checks pass' : 'Issues found'}</b>
          <small>{allOk ? 'Ready to submit for review.' : 'Fix the issues before submitting.'}</small>
        </div>
      </div>
      {checks.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: c.ok ? 'var(--ok-soft)' : 'var(--bad-soft)', color: c.ok ? 'var(--ok)' : 'var(--bad)' }}>
          <span style={{ flexShrink: 0 }}>{c.ok ? <IconCheck size={13} /> : <span style={{ fontWeight: 800 }}>✕</span>}</span>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: 11.5, opacity: 0.75 }}>{c.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── HISTORY PANEL ────────────────────────────────────────────────────────────
function HistoryPanel({ poster }: { poster: Poster }) {
  return (
    <ul className="vlist">
      {[...poster.versions].reverse().map((v, i) => (
        <li key={i} className="vitem">
          <div className="vthumb" style={{ background: 'linear-gradient(145deg,var(--accent-soft),var(--line-2))' }} />
          <div className="vmeta">
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <b>v{v.seq}</b>
              {v.approved && <span style={{ fontSize: 10.5, padding: '1px 6px', borderRadius: 4, background: 'var(--ok-soft)', color: 'var(--ok)', fontWeight: 700 }}>Approved</span>}
              {v.source === 'system' && <span style={{ fontSize: 10.5, padding: '1px 6px', borderRadius: 4, background: 'var(--panel-2)', border: '1px solid var(--line)', color: 'var(--ink-2)' }}>System</span>}
            </div>
            <div className="ins">{v.label}</div>
            <div className="seq">{relTime(v.at)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ─── PROPERTIES PANEL ─────────────────────────────────────────────────────────
function PropertiesPanel({ poster, slot, onChange }: { poster: Poster; slot: string | null; onChange: (field: string, val: string) => void }) {
  const tpl = TPL_MAP[poster.templateId];
  if (!slot) {
    return (
      <div style={{ color: 'var(--ink-3)', fontSize: 13, padding: '8px 0' }}>
        Click any element on the poster to edit it here.
      </div>
    );
  }
  const slotMeta: Record<string, { label: string; field: keyof Poster; maxChars: number; rows?: number }> = {
    eyebrow:   { label: 'Eyebrow',        field: 'eyebrow',  maxChars: 28 },
    headline:  { label: 'Headline',        field: 'headline', maxChars: 48, rows: 2 },
    body:      { label: 'Body copy',       field: 'body',     maxChars: 120, rows: 4 },
    cta:       { label: 'Call to action',  field: 'cta',      maxChars: 22 },
  };
  const meta = slotMeta[slot];
  if (!meta) return <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>Select an editable field.</div>;
  const val = (poster[meta.field] as string) || '';
  const pct = Math.min(100, Math.round((val.length / meta.maxChars) * 100));
  return (
    <div className="insp-sec">
      <h2 className="insp-label">{meta.label}</h2>
      <div className="insp-field">
        <label>{meta.label}</label>
        {(meta.rows || 1) > 1 ? (
          <textarea rows={meta.rows} value={val} onChange={(e) => onChange(meta.field, e.target.value)} maxLength={meta.maxChars * 1.2} />
        ) : (
          <input type="text" value={val} onChange={(e) => onChange(meta.field, e.target.value)} maxLength={meta.maxChars + 5} />
        )}
      </div>
      <div className="insp-meter">
        <div className="insp-meter-row">
          <span>{meta.label}</span>
          <span style={{ fontFamily: 'var(--mono)' }}>
            <b style={{ color: val.length > meta.maxChars ? 'var(--bad)' : undefined }}>{val.length}</b> / {meta.maxChars}
          </span>
        </div>
        <div className="insp-bar">
          <div className={`insp-bar-fill ${val.length > meta.maxChars ? 'over' : ''}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      {tpl?.defaults[meta.field as keyof typeof tpl.defaults] && (
        <button className="btn sm ghost" style={{ alignSelf: 'flex-start', fontSize: 11.5 }}
          onClick={() => onChange(meta.field, String(tpl.defaults[meta.field as keyof typeof tpl.defaults] || ''))}>
          ↺ Reset to template default
        </button>
      )}
    </div>
  );
}

// ─── TEMPLATES DRAWER ─────────────────────────────────────────────────────────
function TemplatesDrawer({ poster, onClose }: { poster: Poster; onClose: () => void }) {
  const tpl = TPL_MAP[poster.templateId];
  const catTpls = Object.values(TPL_MAP).filter((t) => t.cat === tpl?.cat);
  return (
    <>
      <div className="editor-ldrawer-head">
        <h2>Templates</h2>
        <button className="iconbtn sm ghosticon" onClick={onClose}><IconX /></button>
      </div>
      <div className="editor-ldrawer-scroll">
        <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>
          AIA Singapore brand pack. Your text carries over when you switch.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {catTpls.map((t) => (
            <button key={t.id} className="tplc" aria-pressed={poster.templateId === t.id ? 'true' : 'false'}
              style={{ textAlign: 'left' }}>
              <div className="tt" style={{ height: 90, background: t.bg || '#f0f0f0', borderRadius: 6, display: 'grid', placeItems: 'center', fontSize: 8, fontWeight: 700, color: t.accentColor || '#D31145', letterSpacing: '0.03em' }}>
                {t.name}
              </div>
              <b>{t.name}</b>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── MAIN EDITOR PAGE ─────────────────────────────────────────────────────────
export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { posters, setPosters, showToast } = useApp();

  const poster = posters.find((p) => p.id === id);

  const [name, setName] = useState(poster?.name || '');
  const [headline, setHeadline] = useState(poster?.headline || '');
  const [body, setBody] = useState(poster?.body || '');
  const [eyebrow, setEyebrow] = useState(poster?.eyebrow || '');
  const [cta, setCta] = useState(poster?.cta || '');

  const [railTab, setRailTab] = useState<RailTab>(null);
  const [inspTab, setInspTab] = useState<InspTab>('properties');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [showShare, setShowShare] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [saved, setSaved] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  // Compute canvas scale to fit the stage
  useEffect(() => {
    if (!poster) return;
    const sz = SIZES[poster.size];
    const compute = () => {
      if (!stageRef.current) return;
      const { width, height } = stageRef.current.getBoundingClientRect();
      const s = Math.min((width - 80) / sz.w, (height - 100) / sz.h, 0.72);
      setScale(Math.round(s * 1000) / 1000);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [poster?.size]);

  // Sync local state from poster
  useEffect(() => {
    if (poster) {
      setName(poster.name);
      setHeadline(poster.headline);
      setBody(poster.body || '');
      setEyebrow(poster.eyebrow);
      setCta(poster.cta || '');
    }
  }, [id]);

  // Auto-save on field change
  const commit = useCallback((updates: Partial<Poster>) => {
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setPosters(posters.map((p) => p.id === id ? { ...p, ...updates, updated: Date.now() } : p));
      setSaved(true);
    }, 600);
  }, [id, posters, setPosters]);

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'headline') { setHeadline(val); commit({ headline: val }); }
    else if (field === 'body') { setBody(val); commit({ body: val }); }
    else if (field === 'eyebrow') { setEyebrow(val); commit({ eyebrow: val }); }
    else if (field === 'cta') { setCta(val); commit({ cta: val }); }
  };

  const handleNameChange = (v: string) => {
    setName(v);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setPosters(posters.map((p) => p.id === id ? { ...p, name: v, updated: Date.now() } : p));
      setSaved(true);
    }, 800);
  };

  const handleSubmitForReview = () => {
    setPosters(posters.map((p) =>
      p.id === id ? {
        ...p, status: 'review', updated: Date.now(),
        versions: [...p.versions, { seq: p.versions.length + 1, label: 'Submitted for review', source: 'user', at: Date.now() }],
      } : p
    ));
    showToast('Submitted for review. Compliance usually replies within one working day.', 4500);
    setShowSubmitConfirm(false);
    router.push('/posters');
  };

  const handleShared = () => {
    setPosters(posters.map((p) => p.id === id ? { ...p, shares: (p.shares || 0) + 1, updated: Date.now() } : p));
    showToast('Shared successfully (simulated).');
  };

  if (!poster) {
    return (
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-2)' }}>Poster not found.</p>
        <Link href="/posters" className="btn primary" style={{ textDecoration: 'none' }}>Back to My posters</Link>
      </div>
    );
  }

  const livePoster: Poster = { ...poster, headline, body, eyebrow, cta, name };
  const sz = SIZES[poster.size];
  const tpl = TPL_MAP[poster.templateId];
  const checksOk = headline.length <= 48 && (body.length === 0 || body.length <= 120);
  const canSubmit = poster.status === 'draft' || poster.status === 'review';
  const canShare = poster.status === 'approved';

  const rail: { id: RailTab; label: string; icon: React.ReactNode }[] = [
    { id: 'templates', label: 'Templates', icon: <IconTemplates /> },
    { id: 'layers',    label: 'Layers',    icon: <IconLayers size={20} /> },
    { id: 'checks',    label: 'Checks',    icon: <IconShield /> },
    { id: 'history',   label: 'History',   icon: <IconHistory /> },
  ];

  return (
    <div className="editor-app">
      {/* ── Top bar ── */}
      <header className="editor-top">
        <Link href="/posters" className="iconbtn ghosticon" aria-label="Back to My posters" style={{ textDecoration: 'none' }} title="Back to My posters">
          <IconBack size={18} />
        </Link>

        {/* Brand mark */}
        <div className="brandmark" style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0 }} aria-label="AIA" />

        {/* Poster name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <input
            className="ptitle-input"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            aria-label="Poster name"
          />
          <span className={`status ${poster.status}`}><span className="dot" />{STATUS_LABELS[poster.status]}</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{saved ? 'Saved' : 'Saving…'}</span>
        </div>

        {/* Checks pill */}
        <button
          className={`checkchip ${checksOk ? 'ok' : 'bad'}`}
          onClick={() => { setInspTab('checks'); setRailTab(null); }}
          title="Compliance checks"
        >
          <span className="dot" />
          {checksOk ? 'Checks pass' : 'Issues found'}
        </button>

        <span className="protobadge" title="Design prototype for discussion. Sample data, sample compliance wording.">Prototype</span>

        <div style={{ flex: 1 }} />

        {/* Size picker */}
        <button className="btn ghost" style={{ gap: 5, fontSize: 12.5 }} title="Output size">
          {sz.label} {sz.w}×{sz.h}
          <IconChevDown size={13} />
        </button>

        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: 2 }}>
          <button className="iconbtn ghosticon" title="Undo (Ctrl+Z)" disabled>
            <IconUndo />
          </button>
          <button className="iconbtn ghosticon" title="Redo (Shift+Ctrl+Z)" disabled>
            <IconRedo />
          </button>
        </div>

        {/* Preview */}
        <button className="btn" onClick={() => showToast('Preview mode (simulated).')}>
          <IconEye size={13} /> Preview
        </button>

        {/* Submit / Share */}
        {canShare ? (
          <button className="btn primary" onClick={() => setShowShare(true)}>
            <IconSend size={13} /> Share
          </button>
        ) : canSubmit ? (
          <button className="btn primary" onClick={() => setShowSubmitConfirm(true)}>
            <IconCheck size={13} /> Submit for review
          </button>
        ) : (
          <button className="btn" disabled>
            <IconEye size={13} /> View only
          </button>
        )}

        {/* More */}
        <button className="iconbtn" title="More options" onClick={() => showToast('More options menu (simulated).')}>
          <IconMore size={14} />
        </button>
      </header>

      {/* ── Left rail ── */}
      <nav className="editor-rail" aria-label="Editor tools">
        {rail.map((r) => (
          <button
            key={r.id}
            aria-pressed={railTab === r.id}
            title={r.label}
            onClick={() => setRailTab(railTab === r.id ? null : r.id)}
          >
            {r.icon}
            {r.label}
          </button>
        ))}
      </nav>

      {/* ── Center stage ── */}
      <main className="editor-stage">
        {/* Left drawer overlay */}
        {railTab && (
          <div className="editor-ldrawer">
            {railTab === 'templates' && <TemplatesDrawer poster={poster} onClose={() => setRailTab(null)} />}
            {railTab === 'layers' && (
              <>
                <div className="editor-ldrawer-head"><h2>Layers</h2><button className="iconbtn sm ghosticon" onClick={() => setRailTab(null)}><IconX /></button></div>
                <div className="editor-ldrawer-scroll">
                  {['heroImage','eyebrow','headline',poster.body ? 'body' : null, poster.cta ? 'cta' : null,'disclaimer','logo'].filter(Boolean).map((s) => (
                    <button key={s!} style={{ display: 'flex', gap: 10, alignItems: 'center', border: 0, background: selectedSlot === s ? 'var(--accent-soft)' : 'transparent', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', fontSize: 13, textAlign: 'left', color: selectedSlot === s ? 'var(--accent)' : 'var(--ink)' }}
                      onClick={() => { setSelectedSlot(s!); setInspTab('properties'); setRailTab(null); }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', minWidth: 60 }}>{s}</span>
                      <span>{s === 'heroImage' ? 'Hero image' : s === 'eyebrow' ? eyebrow : s === 'headline' ? headline.slice(0,24) + (headline.length > 24 ? '…' : '') : s === 'body' ? (body.slice(0,24) + '…') : s === 'cta' ? cta : s}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {railTab === 'checks' && (
              <>
                <div className="editor-ldrawer-head"><h2>Checks</h2><button className="iconbtn sm ghosticon" onClick={() => setRailTab(null)}><IconX /></button></div>
                <div className="editor-ldrawer-scroll"><ChecksPanel poster={livePoster} /></div>
              </>
            )}
            {railTab === 'history' && (
              <>
                <div className="editor-ldrawer-head"><h2>History</h2><button className="iconbtn sm ghosticon" onClick={() => setRailTab(null)}><IconX /></button></div>
                <div className="editor-ldrawer-scroll"><HistoryPanel poster={poster} /></div>
              </>
            )}
          </div>
        )}

        {/* Canvas */}
        <div className="editor-stage-inner" ref={stageRef} onClick={(e) => { if (e.target === e.currentTarget) setSelectedSlot(null); }}>
          <div className="editor-frame" style={{ position: 'relative' }}>
            {/* Size tag */}
            <div className="editor-size-tag">
              {sz.w} × {sz.h} px · shown at {Math.round(scale * 100)}%
            </div>

            {/* Preview tag */}
            {poster.status === 'approved' && (
              <div className="editor-preview-tag">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block', animation: 'pulse 1.6s ease-in-out infinite' }} />
                APPROVED
              </div>
            )}

            <PosterCanvas
              poster={livePoster}
              scale={scale}
              selectedSlot={selectedSlot}
              onSlotClick={(slot) => { setSelectedSlot(slot); setInspTab('properties'); setRailTab(null); }}
              interactive
            />
          </div>
        </div>

        {/* Stage footer */}
        <div className="editor-foot">
          <button className="editor-addfab" onClick={() => showToast('Add elements panel (simulated).')}>
            <IconPlus2 /> Add to poster
          </button>
          <span className="editor-hint">Click anything on the poster to change it.</span>
        </div>
      </main>

      {/* ── Right inspector ── */}
      <aside className="editor-insp" aria-label="Properties">
        <div className="editor-insp-tabs">
          {(['properties','checks','history'] as const).map((id) => (
            <button key={id} aria-selected={inspTab === id} onClick={() => setInspTab(id)}>
              {id === 'properties' && <IconEdit size={13} />}
              {id === 'checks' && <IconShield />}
              {id === 'history' && <IconHistory />}
              {id === 'properties' ? 'Properties' : id === 'checks' ? 'Checks' : 'History'}
            </button>
          ))}
        </div>

        <div className="editor-insp-body">
          {inspTab === 'properties' && (
            <>
              {!selectedSlot && (
                <div className="insp-sec">
                  <h2 className="insp-label">Canvas</h2>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                    <b style={{ display: 'block', fontSize: 14 }}>{name}</b>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>{sz.label} · {sz.w}×{sz.h}</span>
                  </div>
                  <div style={{ borderRadius: 9, overflow: 'hidden', border: '1px solid var(--line)', width: '100%', height: 160, background: 'var(--line-2)', display: 'grid', placeItems: 'center' }}>
                    <PosterCanvas poster={livePoster} scale={Math.min(130 / sz.w, 150 / sz.h)} />
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>Click any text on the canvas to edit it here.</p>
                </div>
              )}
              {selectedSlot && (
                <PropertiesPanel poster={livePoster} slot={selectedSlot} onChange={handleFieldChange} />
              )}
              <div className="insp-sec">
                <h2 className="insp-label">All fields</h2>
                {[
                  { slot: 'eyebrow', label: 'Eyebrow', val: eyebrow },
                  { slot: 'headline', label: 'Headline', val: headline },
                  ...(poster.body !== undefined ? [{ slot: 'body', label: 'Body copy', val: body }] : []),
                  ...(poster.cta !== undefined ? [{ slot: 'cta', label: 'CTA', val: cta }] : []),
                ].map((f) => (
                  <button key={f.slot} onClick={() => setSelectedSlot(f.slot)} style={{
                    display: 'flex', alignItems: 'baseline', gap: 8, border: '1px solid var(--line)',
                    background: selectedSlot === f.slot ? 'var(--accent-soft)' : 'var(--panel-2)',
                    borderColor: selectedSlot === f.slot ? 'var(--accent)' : 'var(--line)',
                    borderRadius: 8, padding: '8px 10px', cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)', minWidth: 52 }}>{f.label}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{f.val || '—'}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {inspTab === 'checks' && <ChecksPanel poster={livePoster} />}
          {inspTab === 'history' && <HistoryPanel poster={poster} />}
        </div>
      </aside>

      {/* ── Share modal ── */}
      {showShare && (
        <ShareModal poster={livePoster} onClose={() => setShowShare(false)} onShared={handleShared} />
      )}

      {/* ── Submit for review confirm ── */}
      {showSubmitConfirm && (
        <div className="scrim" onClick={(e) => e.target === e.currentTarget && setShowSubmitConfirm(false)}>
          <div className="modal" style={{ maxWidth: 420 }} role="dialog" aria-modal="true">
            <header>
              <h3>Submit for review?</h3>
              <button className="iconbtn ghosticon" onClick={() => setShowSubmitConfirm(false)}><IconX /></button>
            </header>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Compliance will review <b>"{name}"</b> and usually replies within one working day. You will not be able to edit it while it is under review.
              </p>
              {!checksOk && (
                <div style={{ background: 'var(--warn-soft)', color: 'var(--warn)', borderRadius: 10, padding: '10px 12px', fontSize: 13 }}>
                  <b>Some checks did not pass.</b> You can still submit, but fixing them first may speed up approval.
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn" onClick={() => setShowSubmitConfirm(false)}>Cancel</button>
                <button className="btn primary" onClick={handleSubmitForReview}>
                  <IconCheck size={13} /> Submit for review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
