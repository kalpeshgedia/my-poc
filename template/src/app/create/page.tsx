'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/shell/TopBar';
import BottomNav from '@/components/shell/BottomNav';
import { IconBack, IconCheck, PurposeIcon } from '@/components/ui/Icons';
import { useApp } from '@/lib/store';
import {
  PURPOSES, TEMPLATES, SIZES, SizeKey, PurposeCat, TPL_MAP, Template,
  Poster, ADVISER,
} from '@/lib/mockData';

const PHOTO_URLS: Record<string, string> = {
  couple:  'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400&q=80',
  toast:   'https://images.unsplash.com/photo-1555685812-4b8f286d4b6c?w=400&q=80',
  dinner:  'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&q=80',
  headshot:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
};

function TemplatePreview({ tpl, size }: { tpl: Template; size: SizeKey }) {
  const sz = SIZES[size];
  const aspect = sz.w / sz.h;
  const W = 170;
  const H = Math.min(Math.round(W / aspect), 220);
  const isRed = tpl.bg === '#D31145' || tpl.bg === '#9A0828';
  const isBleed = tpl.layout === 'bleed';
  const isSplit = tpl.layout === 'split';

  return (
    <div style={{
      width: W, height: H, position: 'relative', overflow: 'hidden', borderRadius: 6,
      background: isBleed ? '#1a1a2e' : (isRed ? tpl.bg : tpl.bg || '#fff'),
    }}>
      <img
        src={PHOTO_URLS[tpl.heroImage] || PHOTO_URLS.couple}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: '50% 20%',
          opacity: isBleed ? 0.65 : (isRed ? 0 : (isSplit ? 0.5 : 0.5)),
          ...(isSplit && !isRed ? { left: '50%', width: '50%' } : {}),
        }}
      />
      {isBleed && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(31,17,45,.85) 40%, transparent)' }} />
      )}
      {!isBleed && !isSplit && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(255,255,255,.95) 30%, rgba(255,255,255,.3) 70%)' }} />
      )}
      {isRed && isSplit && (
        <div style={{ position: 'absolute', inset: 0, right: '50%', background: tpl.bg }} />
      )}
      <div style={{
        position: 'absolute',
        ...(isBleed ? { bottom: 8, left: 8, right: 8 } : (isSplit ? { left: 8, top: '35%', right: '52%' } : { bottom: 8, left: 8, right: 8 })),
        color: isBleed || isRed ? '#fff' : (tpl.accentColor || '#D31145'),
      }}>
        <div style={{ fontSize: 6, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', opacity: 0.8 }}>
          {tpl.defaults.eyebrow}
        </div>
        <div style={{ fontSize: 9.5, fontWeight: 700, lineHeight: 1.2, marginTop: 1 }}>
          {tpl.defaults.headline}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 5, left: 7, fontSize: 7, fontWeight: 800, color: isBleed || isRed ? '#fff' : '#D31145', letterSpacing: '0.04em' }}>
        AIA
      </div>
    </div>
  );
}

function uid() { return Math.random().toString(36).slice(2, 10); }

function CreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { posters, setPosters, showToast } = useApp();

  const initCat = (searchParams.get('cat') as PurposeCat) || 'life';
  const [cat, setCat] = useState<PurposeCat>(initCat);
  const [tplId, setTplId] = useState<string | null>(null);
  const [size, setSize] = useState<SizeKey>('1080x1350');
  const [posterName, setPosterName] = useState('');
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [cta, setCta] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-17');
  const [eventTime, setEventTime] = useState('2.00pm to 4.30pm');
  const [eventVenue, setEventVenue] = useState('Level 3, Horizon Hall, 1 Robinson Road');

  const catTemplates = TEMPLATES.filter((t) => t.cat === cat);
  const selectedTpl = tplId ? TPL_MAP[tplId] : null;
  const pp = PURPOSES.find((x) => x.cat === cat);

  function handleCreate() {
    if (!tplId) { showToast('Pick a template first.'); return; }
    const tpl = TPL_MAP[tplId];
    const name = posterName.trim() || `${pp?.label} poster`;
    const now = Date.now();
    const newId = uid();
    const newPoster: Poster = {
      id: newId,
      name,
      status: 'draft',
      cat,
      size,
      templateId: tplId,
      created: now,
      updated: now,
      eyebrow: tpl.defaults.eyebrow,
      headline: headline.trim() || tpl.defaults.headline,
      body: body.trim() || tpl.defaults.body,
      cta: cta.trim() || tpl.defaults.cta,
      ...(cat === 'event' ? { eventDate } : {}),
      versions: [{ seq: 1, label: 'Created', source: 'user', at: now }],
    };
    setPosters([newPoster, ...posters]);
    showToast(`"${name}" created. You can edit it now.`, 3000);
    router.push(`/editor/${newId}`);
  }

  return (
    <div className="view">
      <TopBar />
      <div className="page create2">

        {/* Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/home" className="btn ghost" style={{ textDecoration: 'none', gap: 4 }}>
            <IconBack size={16} /> Back
          </Link>
          <h1 style={{ margin: 0, fontSize: 22, letterSpacing: '-.01em' }}>New poster</h1>
        </div>

        {/* Step 1: Purpose */}
        <div>
          <h2 className="step"><span>1</span> What is this poster for?</h2>
          <div className="prow">
            {PURPOSES.map((x) => (
              <button
                key={x.cat}
                className="purpose"
                aria-pressed={cat === x.cat ? 'true' : 'false'}
                onClick={() => { setCat(x.cat); setTplId(null); }}
              >
                <span className="pi"><PurposeIcon name={x.icon} size={18} /></span>
                <span>
                  <b>{x.label}</b>
                  <small>{x.desc}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Size */}
        <div>
          <h2 className="step"><span>2</span> Output size</h2>
          <div className="seg" role="group" aria-label="Output size">
            {(Object.entries(SIZES) as [SizeKey, typeof SIZES[SizeKey]][]).map(([k, s]) => (
              <button
                key={k}
                aria-pressed={size === k ? 'true' : 'false'}
                title={`${s.w}×${s.h}`}
                onClick={() => setSize(k)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Template */}
        <div>
          <h2 className="step"><span>3</span> Pick a template</h2>
          <div className="tplgrid">
            {catTemplates.map((t) => (
              <button
                key={t.id}
                className="tplc"
                aria-pressed={tplId === t.id ? 'true' : 'false'}
                onClick={() => {
                  setTplId(t.id);
                  setHeadline(t.defaults.headline);
                  setBody(t.defaults.body || '');
                  setCta(t.defaults.cta || '');
                }}
              >
                <div className="tt">
                  <TemplatePreview tpl={t} size={size} />
                </div>
                <b>{t.name}</b>
                <span className="pick">Select →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Details */}
        {tplId && (
          <div>
            <h2 className="step"><span>4</span> Details</h2>
            <div className="card" style={{ gap: 16 }}>
              <div className="field">
                <label>Poster name</label>
                <input
                  type="text"
                  placeholder={`${pp?.label} poster`}
                  value={posterName}
                  onChange={(e) => setPosterName(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>
              {selectedTpl && selectedTpl.defaults.body !== undefined && (
                <div className="field">
                  <label>Body copy</label>
                  <textarea
                    rows={3}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              )}
              {selectedTpl && selectedTpl.defaults.cta !== undefined && (
                <div className="field">
                  <label>Call to action</label>
                  <input
                    type="text"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                  />
                </div>
              )}
              {cat === 'event' && (
                <div className="evfields">
                  <div className="field">
                    <label>Event date</label>
                    <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Time</label>
                    <input type="text" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Venue</label>
                    <input type="text" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spacer for cbar */}
        <div style={{ height: 20 }} />
      </div>

      {/* Fixed bottom bar */}
      <div className="cbar">
        <div className="cbar-in">
          <div className="cbar-main">
            <div className="sel">
              <b>{tplId ? TPL_MAP[tplId]?.name : (pp?.label || 'Choose a template')}</b>
              <small>{SIZES[size].label} · {SIZES[size].w}×{SIZES[size].h}</small>
            </div>
            <div className="spacer" />
            <Link href="/home" className="btn" style={{ textDecoration: 'none' }}>Cancel</Link>
            <button
              className="btn primary lg"
              disabled={!tplId}
              onClick={handleCreate}
            >
              <IconCheck size={16} /> Create poster
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="view"><TopBar /><div className="page"><p>Loading…</p></div></div>}>
      <CreateContent />
    </Suspense>
  );
}
