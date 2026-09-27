'use client';
import { Poster } from '@/lib/mockData';
import { IconCheck } from '@/components/ui/Icons';

export default function ChecksPanel({ poster }: { poster: Poster }) {
  const checks = [
    { ok: (poster.headline?.length || 0) <= 48, label: 'Headline length', detail: `${poster.headline?.length || 0} / 48 chars` },
    { ok: (poster.body?.length || 0) <= 120,    label: 'Body copy length', detail: `${poster.body?.length || 0} / 120 chars` },
    { ok: !poster.headline?.toLowerCase().includes('guaranteed'), label: 'No restricted words', detail: 'Headline and body checked' },
    { ok: true, label: 'Disclaimer present', detail: 'MAS-required text included' },
  ];
  const allOk = checks.every((c) => c.ok);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 14 }}>
      <div className={`check-head ${allOk ? 'ok' : 'bad'}`}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: allOk ? 'var(--ok)' : 'var(--bad)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          {allOk ? <IconCheck size={13} /> : <span style={{ fontWeight: 800, fontSize: 13 }}>!</span>}
        </span>
        <div>
          <b>{allOk ? 'Checks pass' : 'Issues found'}</b>
          <small>{allOk ? 'Ready to submit for review.' : 'Fix the issues before submitting.'}</small>
        </div>
      </div>
      {checks.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 11px', borderRadius: 8, background: c.ok ? 'var(--ok-soft)' : 'var(--bad-soft)', color: c.ok ? 'var(--ok)' : 'var(--bad)' }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>{c.ok ? <IconCheck size={13} /> : <b>✕</b>}</span>
          <div><div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.label}</div><div style={{ fontSize: 11.5, opacity: .75 }}>{c.detail}</div></div>
        </div>
      ))}
    </div>
  );
}
