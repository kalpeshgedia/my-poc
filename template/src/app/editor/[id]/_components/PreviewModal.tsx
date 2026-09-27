'use client';
import { useState } from 'react';
import PosterCanvas from '@/components/ui/PosterCanvas';
import { Poster, SIZES } from '@/lib/mockData';
import { IconCheck } from '@/components/ui/Icons';
import { IconX } from '../_icons';
import { PreviewTab } from '../_types';

export default function PreviewModal({ poster, onClose }: { poster: Poster; onClose: () => void }) {
  const [tab, setTab] = useState<PreviewTab>('whatsapp');
  const sz = SIZES[poster.size];

  const tabs: { id: PreviewTab; label: string }[] = [
    { id: 'whatsapp',        label: 'WhatsApp' },
    { id: 'instagram-feed',  label: 'Instagram feed' },
    { id: 'instagram-story', label: 'Instagram Story' },
    { id: 'glance',          label: 'Glance test' },
  ];

  const checks: Record<PreviewTab, string[]> = {
    whatsapp: [
      'Headline appears 17 px tall, readable at a glance',
      'Body text is 7.1 px until opened',
      'The caption under the image comes from the share caption',
    ],
    'instagram-feed': [
      'Image fills the feed card at 1:1 (cropped to square)',
      'Headline readable without opening the post',
      'AIA logo visible in the top corner',
    ],
    'instagram-story': [
      'Full-screen at 9:16 — no letterboxing for Story format',
      'Headline and CTA visible above the safe-zone line',
      'Disclaimer below safe-zone is expected',
    ],
    glance: [
      'Main message readable at thumbnail size',
      'Brand colour is visible at a glance',
      'No small text relied on as the only message',
    ],
  };

  const contextTitle: Record<PreviewTab, string> = {
    whatsapp:        'In a WhatsApp chat',
    'instagram-feed':  'In the Instagram feed',
    'instagram-story': 'As an Instagram Story',
    glance:          'Three-second glance test',
  };
  const contextDesc: Record<PreviewTab, string> = {
    whatsapp:        'Shown about 232 px wide, before the client taps it.',
    'instagram-feed':  'Shown in a square card in the feed.',
    'instagram-story': 'Shown full-screen in Stories.',
    glance:          'Simulated glance — blurred to check impact.',
  };

  const waScale  = Math.min(232 / sz.w, 290 / sz.h);
  const igScale  = 280 / sz.w;
  const stScale  = 160 / sz.w;
  const glScale  = Math.min(232 / sz.w, 300 / sz.h);

  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal preview-modal-lg" role="dialog" aria-modal="true">
        <header style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 12px' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, flex: 1 }}>See it where it will be seen</h3>
          <button className="iconbtn ghosticon" onClick={onClose}><IconX /></button>
        </header>

        <div className="preview-tabs">
          {tabs.map((t) => (
            <button key={t.id} aria-selected={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <div className="preview-layout">
          {/* Left: device */}
          <div className="preview-device-pane">
            {tab === 'whatsapp' && (
              <div className="wa-mock">
                <div className="wa-header">
                  <div className="wa-avatar">TW</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Tan Wei Ling</div>
                    <div style={{ fontSize: 11, opacity: .8 }}>online</div>
                  </div>
                </div>
                <div className="wa-body">
                  <div className="wa-bubble">
                    <div style={{ overflow: 'hidden', borderRadius: '4px 4px 0 0' }}>
                      <PosterCanvas poster={poster} scale={waScale} />
                    </div>
                    <div style={{ padding: '4px 8px 2px', fontSize: 11.5, color: '#111', lineHeight: 1.4 }}>
                      {poster.headline}
                    </div>
                    <div className="wa-meta"><span>10:42</span><span>✓✓</span></div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'instagram-feed' && (
              <div style={{ width: 280, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 28px rgba(0,0,0,.15)' }}>
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #eee' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#D31145', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>J</div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>jane.tan.aia</span>
                </div>
                <div style={{ width: 280, height: 280, overflow: 'hidden' }}>
                  <PosterCanvas poster={poster} scale={igScale} />
                </div>
                <div style={{ padding: '10px 12px', fontSize: 11.5 }}>
                  <span style={{ fontWeight: 600 }}>jane.tan.aia </span>
                  <span style={{ color: '#555' }}>{poster.headline}</span>
                </div>
              </div>
            )}

            {tab === 'instagram-story' && (
              <div style={{ width: 160, height: 285, background: '#000', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 28px rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PosterCanvas poster={poster} scale={stScale} />
              </div>
            )}

            {tab === 'glance' && (
              <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 28px rgba(0,0,0,.15)' }}>
                <div style={{ filter: 'blur(5px)', transform: 'scale(1.06)', transformOrigin: 'center' }}>
                  <PosterCanvas poster={poster} scale={glScale} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,.45)', color: '#fff', fontSize: 10.5, fontWeight: 600, padding: '6px 10px', textAlign: 'center' }}>
                  Simulated 3-second glance
                </div>
              </div>
            )}
          </div>

          {/* Right: checks */}
          <div className="preview-checks-pane">
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{contextTitle[tab]}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 14 }}>{contextDesc[tab]}</div>
            </div>
            {checks[tab].map((c, i) => (
              <div key={i} className="preview-check-item">
                <span style={{ flexShrink: 0, marginTop: 1 }}><IconCheck size={13} /></span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
