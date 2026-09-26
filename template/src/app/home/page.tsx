'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/shell/TopBar';
import BottomNav from '@/components/shell/BottomNav';
import PosterThumb from '@/components/ui/PosterThumb';
import { IconPlus, IconCheck, PurposeIcon } from '@/components/ui/Icons';
import { useApp } from '@/lib/store';
import {
  ADVISER, CAMPAIGNS, upcomingOccasions, daysTo, fmtDayMonth,
  STATUS_LABELS, statusKey, TPL_MAP,
} from '@/lib/mockData';

export default function HomePage() {
  const router = useRouter();
  const { posters, showToast } = useApp();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const liveCampaigns = CAMPAIGNS.filter((c) => daysTo(c.until) >= 0);
  const nextOccasions = upcomingOccasions(3);

  const drafts   = posters.filter((p) => p.status === 'draft');
  const review   = posters.filter((p) => p.status === 'review');
  const approved = posters.filter((p) => p.status === 'approved');

  const counts = [
    { key: 'approved', n: approved.length, label: 'ready to share', href: '/posters?filter=approved' },
    { key: 'draft',    n: drafts.length,   label: 'drafts',         href: '/posters?filter=draft' },
    { key: 'review',   n: review.length,   label: 'with Compliance',href: '/posters?filter=review' },
  ].filter((c) => c.n > 0);

  const todoItems = [
    ...review.slice(0, 1).map((p) => ({
      kind: 'warn' as const,
      title: `"${p.name}" is with Compliance`,
      sub: 'Usually replies within one working day.',
      label: 'View',
      fn: () => router.push('/posters?filter=review'),
    })),
    ...approved.slice(0, 1).map((p) => ({
      kind: 'ok' as const,
      title: `"${p.name}" is ready to share`,
      sub: 'Approved by Compliance. Share it now.',
      label: 'Share now',
      fn: () => { showToast(`Sharing "${p.name}" (simulated).`); },
    })),
  ];

  return (
    <div className="view">
      <TopBar />
      <div className="page home2">
        {/* Greeting */}
        <section className="hello">
          <div>
            <h1>{greeting}, {ADVISER.firstName}</h1>
            <p>{todoItems.length > 0
              ? `${todoItems.length === 1 ? 'One thing needs' : `${todoItems.length} things need`} you today.`
              : 'You are all caught up.'}</p>
          </div>
          <Link href="/create" className="btn primary lg" style={{ textDecoration: 'none' }}>
            <IconPlus /> Create a poster
          </Link>
        </section>

        {/* To-do */}
        {todoItems.length > 0 && (
          <section className="card todo">
            <h2>To do</h2>
            <ul className="todolist">
              {todoItems.map((t, i) => (
                <li key={i}>
                  <span className={`tdi ${t.kind}`}>
                    <IconCheck size={16} />
                  </span>
                  <span className="tdt">
                    <b>{t.title}</b>
                    <small>{t.sub}</small>
                  </span>
                  <button className={`btn${i === 0 ? ' primary' : ''}`} onClick={t.fn}>{t.label}</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Review waitline */}
        {review.length > 0 && (
          <div className="waitline">
            <span className="status review"><span className="dot" />{STATUS_LABELS.review}</span>
            <span>
              {review.length === 1
                ? `"${review[0].name}" is with Compliance.`
                : `${review.length} posters are with Compliance.`}
              {' '}They usually reply within one working day. Nothing to do until then.
            </span>
            <Link href="/posters?filter=review" className="linkbtn" style={{ textDecoration: 'none' }}>View</Link>
          </div>
        )}

        {/* Start something */}
        <section>
          <h2 className="h2">Start something</h2>
          <div className="startrow">
            {/* Create poster */}
            <article className="startcard">
              <span className="sci"><IconPlus size={20} /></span>
              <b>Create a poster</b>
              <p>Pick what it is for and a template. It starts as a draft for you to edit.</p>
              <Link href="/create" className="btn primary lg" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                Create a poster
              </Link>
            </article>

            {/* Ready-made */}
            <article className="startcard">
              <span className="sci"><IconCheck size={20} /></span>
              <b>Share a ready-made poster</b>
              <p>
                {liveCampaigns.length} campaign{liveCampaigns.length === 1 ? '' : 's'} from AIA Marketing, already
                approved. Your details are added; no review needed.
              </p>
              {liveCampaigns.length > 0 && (
                <div className="scthumbs">
                  {liveCampaigns.slice(0, 2).map((c) => {
                    const sp = c.posters[0];
                    const previewPoster = {
                      id: `camp-${c.id}`, name: sp.name, status: 'approved' as const,
                      cat: (TPL_MAP[sp.tpl]?.cat || 'life') as import('@/lib/mockData').PurposeCat,
                      size: sp.size, templateId: sp.tpl,
                      created: Date.now(), updated: Date.now(),
                      eyebrow: sp.eyebrow || '', headline: sp.headline || '', versions: [],
                    };
                    return (
                      <PosterThumb key={c.id} poster={previewPoster} width={64} height={80} />
                    );
                  })}
                </div>
              )}
              <Link href="/campaigns" className="btn lg" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                See ready-made posters
              </Link>
            </article>

            {/* Greeting */}
            <article className="startcard">
              <span className="sci"><PurposeIcon name="star" size={20} /></span>
              <b>Send a greeting</b>
              {nextOccasions.length > 0 ? (
                <p>
                  Next: {nextOccasions[0].name},{' '}
                  {nextOccasions[0].days === 0 ? 'today' : `in ${nextOccasions[0].days} days`}
                  {nextOccasions[0].approx ? ' (date to be confirmed)' : ''}.
                </p>
              ) : (
                <p>No festivals coming up.</p>
              )}
              {nextOccasions.length > 1 && (
                <div className="occchips">
                  {nextOccasions.slice(1).map((o) => (
                    <button key={o.id} onClick={() => { showToast(`Creating ${o.name} greeting…`); router.push('/create?cat=greet'); }}>
                      {o.name} · {fmtDayMonth(o.date)}
                    </button>
                  ))}
                </div>
              )}
              {nextOccasions.length > 0 && (
                <button className="btn lg" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { showToast(`Creating ${nextOccasions[0].name} greeting…`); router.push('/create?cat=greet'); }}>
                  Make a {nextOccasions[0].name} greeting
                </button>
              )}
            </article>
          </div>
        </section>

        {/* My posters summary */}
        <section>
          <div className="sechead">
            <h2 className="h2" style={{ margin: 0 }}>My posters</h2>
            <div className="spacer" />
            <Link href="/posters" className="linkbtn" style={{ textDecoration: 'none' }}>See all my posters →</Link>
          </div>
          {counts.length > 0 ? (
            <div className="sumchips">
              {counts.map(({ key, n, label, href }) => (
                <Link key={key} href={href} style={{ textDecoration: 'none' }}>
                  <button><b>{n}</b> {label}</button>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty card">
              <b>No posters yet.</b>
              <Link href="/create" className="btn primary" style={{ textDecoration: 'none' }}>Create your first poster</Link>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="foot">
          <span>·</span>
          <span>Prototype, not an official AIA tool. Sample data, saved in this browser only.</span>
        </footer>
      </div>
      <BottomNav />
    </div>
  );
}
