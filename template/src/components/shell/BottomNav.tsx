'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconGrid, IconCheck, IconCalendar, IconPlus } from '@/components/ui/Icons';

const NAV = [
  { href: '/home',      label: 'Home',     Icon: IconHome },
  { href: '/posters',   label: 'Posters',  Icon: IconGrid },
  { href: '/create',    label: '',         Icon: IconPlus, fab: true },
  { href: '/campaigns', label: 'Ready-made', Icon: IconCheck },
  { href: '/events',    label: 'Events',   Icon: IconCalendar },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="botnav" aria-label="Mobile navigation">
      {NAV.map((item) =>
        item.fab ? (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <button aria-label="Create a poster">
              <span className="fab"><item.Icon size={22} /></span>
            </button>
          </Link>
        ) : (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <button aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>
              <item.Icon size={20} />
              {item.label}
            </button>
          </Link>
        )
      )}
    </nav>
  );
}
