'use client';
import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/shell/TopBar';
import BottomNav from '@/components/shell/BottomNav';
import { IconSend, IconEdit, IconCheck } from '@/components/ui/Icons';
import { useApp } from '@/lib/store';
import { CAMPAIGNS, Campaign, CampaignPoster, daysTo, fmtShort, SIZES, TPL_MAP } from '@/lib/mockData';

const PHOTO_URLS: Record<string, string> = {
  couple:  'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400&q=80',
  toast:   'https://images.unsplash.com/photo-1555685812-4b8f286d4b6c?w=400&q=80',
  dinner:  'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&q=80',
  headshot:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
};

function CampaignPosterThumb({ sp }: { sp: CampaignPoster }) {
  const tpl = TPL_MAP[sp.tpl];
  const sz = SIZES[sp.size];
  const aspect = sz.w / sz.h;
  const W = 160;
  const H = Math.min(Math.round(W / aspect), 200);
  const photoKey = tpl?.heroImage || 'couple';
  const isRed = tpl?.bg === '#D31145' || tpl?.bg === '#9A0828';
  const isBleed = tpl?.layout === 'bleed';

  return (
    <div style={{
      width: W, height: H, position: 'relative', overflow: 'hidden', borderRadius: 6,
      background: isBleed ? '#1a1a2e' : (isRed ? '#D31145' : (tpl?.bg || '#fff')),
      boxShadow: '0 8px 24px -10px rgba(31,42,55,.5)',
    }}>
      <img
        src={PHOTO_URLS[photoKey] || PHOTO_URLS.couple}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: '50% 20%',
          opacity: isBleed ? 0.65 : (isRed ? 0 : 0.5),
        }}
      />
      {isBleed && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(31,17,45,.85) 40%, transparent)' }} />
      )}
      <div style={{
        position: 'absolute', bottom: 8, left: 8, right: 8,
        color: isBleed || isRed ? '#fff' : '#D31145',
      }}>
        <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', opacity: 0.8 }}>
          {sp.eyebrow || tpl?.defaults.eyebrow}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2, marginTop: 2 }}>
          {sp.headline || tpl?.defaults.headline}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 6, left: 7, fontSize: 8, fontWeight: 800, color: isBleed || isRed ? '#fff' : '#D31145', letterSpacing: '0.04em' }}>
        AIA
      </div>
    </div>
  );
}

function CampaignSection({ c, over }: { c: Campaign; over: boolean }) {
  const { showToast } = useApp();
  const left = daysTo(c.until);

  return (
    <section className="card campsec" id={`camp-${c.id}`}>
      <div className="camphead">
        <div>
          <h2>{c.name}</h2>
          <p className="secsub">{c.period} · {c.blurb}</p>
        </div>
        {over ? (
          <span className="badge">Campaign ended</span>
        ) : (
          <span className="badge ok big">
            <IconCheck size={12} />
            Pre-approved until {fmtShort(c.until)}
            <span className="left">
              {left === 0 ? ' · last day' : ` · ${left} day${left === 1 ? '' : 's'} left`}
            </span>
          </span>
        )}
      </div>

      <div className="campgrid">
        {c.posters.map((sp, i) => (
          <div key={i} className="campitem">
            <div
              className="campbox"
              style={{ cursor: over ? 'default' : 'pointer' }}
              onClick={over ? undefined : () => showToast(`Sharing "${sp.name}" (simulated).`)}
              title={over ? undefined : 'Share now'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <CampaignPosterThumb sp={sp} />
              </div>
            </div>
            <b>{sp.name}</b>
            <small>{SIZES[sp.size].label} · {SIZES[sp.size].w}×{SIZES[sp.size].h}</small>
            <div className="row-btns">
              <button
                className="btn primary"
                disabled={over}
                onClick={() => showToast(`Sharing "${sp.name}" now (simulated).`)}
              >
                <IconSend size={13} /> Share now
              </button>
              <button
                className="btn"
                disabled={over}
                onClick={() => showToast('Your copy is open. Layout and colour changes keep the approval; changing words or photo sends it to Compliance.', 5600)}
                title="Edit it first. Changed words or photos go to Compliance."
              >
                <IconEdit size={13} /> Personalise
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CampaignsPage() {
  const live  = CAMPAIGNS.filter((c) => daysTo(c.until) >= 0);
  const ended = CAMPAIGNS.filter((c) => daysTo(c.until) <  0);

  return (
    <div className="view">
      <TopBar />
      <div className="page">
        <div className="pagehead">
          <div>
            <h1>Ready-made posters</h1>
            <p>
              Made by AIA Marketing and already approved by Compliance. Your verified name, photo and
              contact are added for you. Share them as they are, with no review needed.
            </p>
          </div>
        </div>

        <div className="note">
          <b>Share now</b> sends the poster exactly as approved.{' '}
          <b>Personalise</b> lets you change it first; if you change the words or the photo, it goes
          to Compliance before you can share it.
        </div>

        {live.map((c) => <CampaignSection key={c.id} c={c} over={false} />)}

        {ended.length > 0 && (
          <details className="fold card" style={{ padding: '14px 16px' }}>
            <summary>Ended campaigns ({ended.length})</summary>
            <div className="foldbody">
              {ended.map((c) => <CampaignSection key={c.id} c={c} over />)}
            </div>
          </details>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
