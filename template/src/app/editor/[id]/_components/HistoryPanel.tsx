'use client';
import { Poster, relTime } from '@/lib/mockData';

export default function HistoryPanel({ poster }: { poster: Poster }) {
  return (
    <ul className="vlist" style={{ margin: 0, padding: '8px 14px' }}>
      {[...poster.versions].reverse().map((v, i) => (
        <li key={i} className="vitem">
          <div className="vthumb" style={{ background: 'linear-gradient(145deg,var(--accent-soft),var(--line-2))' }} />
          <div className="vmeta">
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <b>v{v.seq}</b>
              {v.approved && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--ok-soft)', color: 'var(--ok)', fontWeight: 700 }}>Approved</span>}
            </div>
            <div className="ins">{v.label}</div>
            <div className="seq">{relTime(v.at)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
