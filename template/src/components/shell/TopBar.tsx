'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADVISER } from '@/lib/mockData';
import { IconBell, IconPlus } from '@/components/ui/Icons';

const NAV_TABS = [
  { id: 'home',      label: 'Home',              href: '/home' },
  { id: 'posters',   label: 'My posters',         href: '/posters' },
  { id: 'campaigns', label: 'Ready-made',          href: '/campaigns' },
  { id: 'events',    label: 'Events',              href: '/events' },
];

export default function TopBar() {
  const pathname = usePathname();

  const active = NAV_TABS.find((t) => pathname === t.href || pathname.startsWith(t.href + '/'))?.id || 'home';

  return (
    <header className="apptop">
      {/* Brand */}
      <Link href="/home" className="brandblk" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="brandmark" aria-label="AIA" />
        <div>
          <b>Templator</b>
          <small>for AIA Singapore</small>
        </div>
      </Link>

      {/* Nav tabs */}
      <nav className="navtabs" aria-label="Main navigation">
        {NAV_TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            style={{ textDecoration: 'none' }}
          >
            <button aria-current={active === tab.id ? 'page' : undefined}>
              {tab.label}
            </button>
          </Link>
        ))}
      </nav>

      <div className="spacer" />

      <span className="protobadge" title="Design prototype. Sample data, saved in browser only.">Prototype</span>

      {/* Create button */}
      <Link href="/create" className="btn primary topcreate" style={{ textDecoration: 'none' }}>
        <IconPlus /> Create a poster
      </Link>

      {/* Bell */}
      <button className="iconbtn bell" aria-label="Notifications">
        <IconBell />
        <span className="dot" aria-hidden="true" />
      </button>

      {/* Avatar */}
      <button className="who" aria-label={ADVISER.name}>
        <div className="av" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80')` }} />
        <div className="t">
          <b>{ADVISER.name}</b>
          <small>{ADVISER.title}</small>
        </div>
      </button>
    </header>
  );
}
