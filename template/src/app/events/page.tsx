'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/shell/TopBar';
import BottomNav from '@/components/shell/BottomNav';
import PosterThumb from '@/components/ui/PosterThumb';
import { IconPlus, IconSend, IconEdit } from '@/components/ui/Icons';
import { useApp } from '@/lib/store';
import { Poster, daysTo, fmtShort, statusKey } from '@/lib/mockData';

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

function dayOf(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return { day: d.getDate(), mon: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase() };
}

// deterministic fake signups seeded from poster id
function hashId(id: string) {
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  return h;
}

function EventRow({ poster }: { poster: Poster & { eventDate: string } }) {
  const { showToast } = useApp();
  const sk = statusKey(poster);
  const { day, mon } = dayOf(poster.eventDate);
  const isPast = daysTo(poster.eventDate) < 0;

  // Deterministic signup stats from poster id
  const signups = (hashId(poster.id) % 55) + 18;
  const capacity = 80;
  const pct = Math.round(signups / capacity * 100);

  return (
    <div className={`evrow${isPast ? ' past' : ''}`}>
      {/* Thumb */}
      <div className="evthumb">
        <PosterThumb poster={poster} width={120} height={90} />
      </div>

      {/* Main info */}
      <div className="evmain">
        <div className="evtitle">
          <b>{poster.name}</b>
          <span className={`status ${sk}`}><span className="dot" />{sk === 'approved' ? 'Approved' : sk === 'draft' ? 'Draft' : 'With Compliance'}</span>
        </div>
        <div className="evwhen">{fmtDate(poster.eventDate)}</div>
        <div className="evwhere">Level 3, Horizon Hall, 1 Robinson Road</div>
        {!isPast && (
          <div className="evstats">
            <div className="stat">
              <small>Signed up</small>
              <b>{signups} <span>/ {capacity}</span></b>
              <div className="bar"><i style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="stat">
              <small>Attended</small>
              <b className="sm">—</b>
            </div>
            <div className="stat">
              <small>Days to go</small>
              <b>{daysTo(poster.eventDate)}</b>
            </div>
            <div className="stat">
              <small>QR scans</small>
              <b>{Math.floor(signups * 1.4)}</b>
            </div>
          </div>
        )}
        {isPast && (
          <div className="evstats">
            <div className="stat">
              <small>Signed up</small>
              <b>{signups}</b>
            </div>
            <div className="stat">
              <small>Attended</small>
              <b>{Math.floor(signups * 0.82)}</b>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="evactions">
        {sk === 'approved' && !isPast && (
          <button className="btn primary" onClick={() => showToast(`Sharing "${poster.name}" (simulated).`)}>
            <IconSend size={13} /> Share poster
          </button>
        )}
        <Link href={`/editor/${poster.id}`} className="btn" style={{ textDecoration: 'none', justifyContent: 'center' }}>
          <IconEdit size={13} /> {sk === 'draft' ? 'Continue editing' : 'Open'}
        </Link>
        {isPast && (
          <button className="btn" onClick={() => showToast('Thank-you post created (simulated).')}>
            Send a thank-you post
          </button>
        )}
        {!isPast && sk === 'approved' && (
          <button className="btn" onClick={() => showToast(`Reminder queued for ${signups} guests (simulated).`)}>
            Send reminder
          </button>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { posters } = useApp();
  const router = useRouter();

  const eventPosters = posters.filter((p) => !!p.eventDate) as (Poster & { eventDate: string })[];
  const upcoming = eventPosters.filter((p) => daysTo(p.eventDate) >= 0).sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  const past     = eventPosters.filter((p) => daysTo(p.eventDate) <  0).sort((a, b) => b.eventDate.localeCompare(a.eventDate));

  return (
    <div className="view">
      <TopBar />
      <div className="page">
        <div className="pagehead">
          <div>
            <h1>Events</h1>
            <p>Every event poster has a QR code that opens a sign-up page. Who is coming, reminders and attendance are all here.</p>
          </div>
          <Link href="/create?cat=event" className="btn primary" style={{ textDecoration: 'none' }}>
            <IconPlus /> New event invite
          </Link>
        </div>

        {/* Upcoming */}
        <section>
          <h2 className="h2">Coming up</h2>
          {upcoming.length > 0 ? (
            <div className="evlist">
              {upcoming.map((p) => <EventRow key={p.id} poster={p} />)}
            </div>
          ) : (
            <div className="empty card">
              <b>No events coming up.</b>
              <span>Create an event invite and your sign-ups will appear here.</span>
              <Link href="/create?cat=event" className="btn primary" style={{ textDecoration: 'none', alignSelf: 'center', marginTop: 8 }}>
                New event invite
              </Link>
            </div>
          )}
        </section>

        {/* Past events */}
        {past.length > 0 && (
          <details className="fold evpast">
            <summary>
              Past events ({past.length})
              <small>Guests to thank</small>
            </summary>
            <div className="foldbody">
              <div className="evlist">
                {past.map((p) => <EventRow key={p.id} poster={p} />)}
              </div>
            </div>
          </details>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
