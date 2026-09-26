'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/shell/TopBar';
import BottomNav from '@/components/shell/BottomNav';
import PosterThumb from '@/components/ui/PosterThumb';
import { IconSearch, IconPlus, IconEdit, IconEye, IconSend, IconMore } from '@/components/ui/Icons';
import { useApp } from '@/lib/store';
import { Poster, SIZES, STATUS_LABELS, statusKey, relTime, TPL_MAP } from '@/lib/mockData';

const TABS = [
  { id: 'all',      label: 'All' },
  { id: 'draft',    label: 'Drafts' },
  { id: 'review',   label: 'With Compliance' },
  { id: 'approved', label: 'Ready to share' },
  { id: 'past',     label: 'Past events' },
];

function PostersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { posters, showToast } = useApp();

  const initFilter = searchParams.get('filter') || 'all';
  const [filter, setFilter] = useState(initFilter);
  const [q, setQ] = useState('');

  const counts = useMemo(() => {
    const past = posters.filter((p) => statusKey(p) === 'past');
    return {
      all:      posters.length,
      draft:    posters.filter((p) => p.status === 'draft').length,
      review:   posters.filter((p) => p.status === 'review').length,
      approved: posters.filter((p) => p.status === 'approved').length,
      past:     past.length,
    };
  }, [posters]);

  const filtered = useMemo(() => {
    let list = posters;
    if (filter !== 'all') {
      if (filter === 'past') list = list.filter((p) => statusKey(p) === 'past');
      else list = list.filter((p) => p.status === filter);
    }
    if (q.trim()) {
      const lq = q.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(lq) || p.cat.toLowerCase().includes(lq)
      );
    }
    return [...list].sort((a, b) => b.updated - a.updated);
  }, [posters, filter, q]);

  const visibleTabs = TABS.filter((t) => t.id !== 'past' || counts.past > 0);

  return (
    <div className="view">
      <TopBar />
      <div className="page">
        {/* Header */}
        <div className="pagehead">
          <div>
            <h1>My posters</h1>
            <p>Every poster you have made. Open one to continue, or share the ones that are ready.</p>
          </div>
          <label className="search">
            <IconSearch />
            <input
              type="search"
              placeholder="Search posters"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search posters"
            />
          </label>
        </div>

        {/* Filter tabs */}
        <div className="tabs2" role="tablist">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
              <span className="n">{counts[tab.id as keyof typeof counts]}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="pgrid">
          {filtered.length === 0 ? (
            <div className="empty">
              <b>{q ? 'No posters match your search.' : 'Nothing here yet.'}</b>
              <Link href="/create" className="btn" style={{ textDecoration: 'none', alignSelf: 'center', marginTop: 8 }}>
                <IconPlus /> Create a poster
              </Link>
            </div>
          ) : (
            filtered.map((p) => <PosterCard key={p.id} poster={p} onAction={(msg) => showToast(msg)} />)
          )}

          {/* New card */}
          {filtered.length > 0 && (
            <Link href="/create" style={{ textDecoration: 'none' }}>
              <article className="pcard newcard" style={{ display: 'flex' }}>
                <div className="plus"><IconPlus size={22} /></div>
                <b>New poster</b>
                <small>Pick a purpose and template</small>
              </article>
            </Link>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function PosterCard({ poster, onAction }: { poster: Poster; onAction: (msg: string) => void }) {
  const sz = SIZES[poster.size];
  const sk = statusKey(poster);
  const [menuOpen, setMenuOpen] = useState(false);

  const thumbW = 170;
  const thumbH = Math.min(Math.round(thumbW * sz.h / sz.w), 232);

  let actionBtn;
  if (sk === 'draft') {
    actionBtn = (
      <Link href={`/editor/${poster.id}`} className="btn sm" style={{ textDecoration: 'none' }}>
        <IconEdit size={13} /> Continue
      </Link>
    );
  } else if (sk === 'review' || sk === 'past') {
    actionBtn = (
      <Link href={`/editor/${poster.id}`} className="btn sm" style={{ textDecoration: 'none' }}>
        <IconEye size={13} /> View
      </Link>
    );
  } else {
    actionBtn = (
      <button className="btn sm primary" onClick={() => onAction(`Sharing "${poster.name}" (simulated).`)}>
        <IconSend size={13} /> {sk === 'shared' ? 'Share again' : 'Share'}
      </button>
    );
  }

  return (
    <article className="pcard">
      <div className="pthumb">
        <div className="holder">
          <PosterThumb poster={poster} width={thumbW} height={thumbH} />
        </div>
      </div>

      <button className="more" aria-label="More options" onClick={() => setMenuOpen((v) => !v)}>
        <IconMore size={14} />
      </button>

      <div className="pmeta">
        <Link href={`/editor/${poster.id}`} className="nm" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>{poster.name}</Link>
        <div className="sub">{SIZES[poster.size].label} · {sz.w}×{sz.h}</div>
        <div className="row">
          <div className="pills">
            <StatusPill status={sk} />
          </div>
          {actionBtn}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{relTime(poster.updated)}</div>
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`status ${status}`}>
      <span className="dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default function PostersPage() {
  return (
    <Suspense fallback={<div className="view"><TopBar /><div className="page"><p>Loading…</p></div></div>}>
      <PostersContent />
    </Suspense>
  );
}
