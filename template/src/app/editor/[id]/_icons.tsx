'use client';

// ─── SVG icons specific to the editor (not in src/components/ui/Icons.tsx) ───

export function Ico({ d, size = 18, fill = 'none', stroke = 'currentColor', sw = 2 }: {
  d: string; size?: number; fill?: string; stroke?: string; sw?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export const IconTemplates = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="11" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/>
    <rect x="13" y="11" width="8" height="7" rx="1.5"/><rect x="3" y="17" width="8" height="4" rx="1.5"/>
  </svg>
);

export const IconShield = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6Z"/>
  </svg>
);

export const IconClock = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>
  </svg>
);

export const IconUndo = () => <Ico d="M9 14 4 9l5-5" size={15} />;
export const IconRedo = () => <Ico d="m15 14 5-5-5-5" size={15} />;

export const IconX = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18"/>
  </svg>
);

export const IconPlus2 = () => <Ico d="M12 5v14M5 12h14" size={17} sw={2.2} />;

export const IconSpark = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5c.4 3.9 1.9 6.4 6.9 7.6-5 1.2-6.5 3.7-6.9 7.6-.4-3.9-1.9-6.4-6.9-7.6 5-1.2 6.5-3.7 6.9-7.6Z"/>
    <path d="M19 15.5c.2 1.8.9 2.9 3 3.4-2.1.5-2.8 1.6-3 3.4-.2-1.8-.9-2.9-3-3.4 2.1-.5 2.8-1.6 3-3.4Z"/>
  </svg>
);

export const IconTypeOn = () => <Ico d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" size={14} />;

export const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
);

export const IconAlignLeft    = () => <Ico d="M3 6h18M3 12h12M3 18h15" size={14} />;
export const IconAlignCenter  = () => <Ico d="M3 6h18M6 12h12M4.5 18h15" size={14} />;
export const IconAlignRight   = () => <Ico d="M3 6h18M9 12h12M6 18h15" size={14} />;
export const IconChevronDown  = () => <Ico d="m6 9 6 6 6-6" size={14} />;

export const IconPhoto        = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
