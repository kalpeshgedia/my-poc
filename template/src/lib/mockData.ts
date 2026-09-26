export type PosterStatus = 'draft' | 'review' | 'approved' | 'shared';
export type SizeKey = '1080x1350' | '1080x1080' | '1200x628' | '1080x1920';
export type PurposeCat = 'life' | 'ci' | 'ret' | 'sav' | 'event' | 'greet';

export interface Purpose {
  cat: PurposeCat;
  label: string;
  desc: string;
  icon: string;
}

export interface Template {
  id: string;
  cat: PurposeCat;
  name: string;
  layout: 'hero' | 'bleed' | 'split';
  bg: string;
  panel: string;
  accentColor: string;
  heroImage: string;
  defaults: {
    eyebrow: string;
    headline: string;
    body?: string;
    cta?: string;
  };
}

export interface CampaignPoster {
  name: string;
  tpl: string;
  size: SizeKey;
  eyebrow?: string;
  headline?: string;
  body?: string;
  cta?: string;
}

export interface Campaign {
  id: string;
  name: string;
  short: string;
  period: string;
  until: string;
  blurb: string;
  posters: CampaignPoster[];
}

export interface Occasion {
  id: string;
  name: string;
  date: string;
  tpl: string;
  approx?: boolean;
  content: { eyebrow: string; headline: string; body?: string };
}

export interface PosterVersion {
  seq: number;
  label: string;
  source: string;
  at: number;
  approved?: boolean;
}

export interface Poster {
  id: string;
  name: string;
  status: PosterStatus;
  cat: PurposeCat;
  size: SizeKey;
  templateId: string;
  created: number;
  updated: number;
  shares?: number;
  campaign?: string;
  versions: PosterVersion[];
  eventDate?: string;
  eyebrow: string;
  headline: string;
  body?: string;
  cta?: string;
}

export const ADVISER = {
  name: 'Jane Tan',
  firstName: 'Jane',
  title: 'Financial Services Consultant',
  phone: '+65 9123 4567',
  email: 'jane.tan@example.com',
  repNo: 'Rep. No. JT0012345',
};

export const SIZES: Record<SizeKey, { w: number; h: number; label: string; kind: string }> = {
  '1080x1350': { w: 1080, h: 1350, kind: 'tall', label: 'Portrait' },
  '1080x1080': { w: 1080, h: 1080, kind: 'square', label: 'Square' },
  '1200x628':  { w: 1200, h: 628,  kind: 'wide',   label: 'Landscape' },
  '1080x1920': { w: 1080, h: 1920, kind: 'story',  label: 'Story' },
};

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  review: 'With Compliance',
  approved: 'Ready to share',
  shared: 'Shared',
  past: 'Event over',
};

export const PURPOSES: Purpose[] = [
  { cat: 'life',  label: 'Protection',      desc: 'Life cover for families',        icon: 'umbrella' },
  { cat: 'ci',    label: 'Critical illness', desc: 'Awareness and check-ins',        icon: 'heart' },
  { cat: 'ret',   label: 'Retirement',       desc: 'Income and planning',            icon: 'home' },
  { cat: 'sav',   label: 'Savings',          desc: 'Goals and education',            icon: 'cap' },
  { cat: 'event', label: 'Event invite',     desc: 'Seminars, with date and QR',     icon: 'calendar' },
  { cat: 'greet', label: 'Greeting',         desc: 'Festive wishes, no selling',     icon: 'star' },
];

// palette per category for poster mockups
const CAT_PALETTE: Record<PurposeCat, { bg: string; text: string; accent: string }> = {
  life:  { bg: 'linear-gradient(145deg,#fff 45%,#FCE8EE 100%)', text: '#D31145', accent: '#D31145' },
  ci:    { bg: 'linear-gradient(145deg,#FFF5F7 40%,#F4A9BE 100%)', text: '#D31145', accent: '#D31145' },
  ret:   { bg: 'linear-gradient(145deg,#F7F8FB 45%,#FCE8EE 100%)', text: '#D31145', accent: '#D31145' },
  sav:   { bg: 'linear-gradient(145deg,#fff 45%,#E8ECF2 100%)', text: '#1F2A37', accent: '#D31145' },
  event: { bg: 'linear-gradient(145deg,#fff 45%,#FCE8EE 100%)', text: '#D31145', accent: '#D31145' },
  greet: { bg: 'linear-gradient(145deg,#FFF5F7 45%,#F4A9BE 100%)', text: '#D31145', accent: '#D31145' },
};
export { CAT_PALETTE };

export const TEMPLATES: Template[] = [
  { id: 'life-focus-01',   cat: 'life',  name: 'Future in Focus',       layout: 'hero',  bg: '#fff',    panel: '#fff',    accentColor: '#D31145', heroImage: 'toast',   defaults: { eyebrow: 'Life Protection',         headline: 'Your Future in Focus',                body: "Protection that keeps your family's plans on track, whatever tomorrow brings.", cta: 'Talk to me' } },
  { id: 'life-warmth-02',  cat: 'life',  name: 'Warmth of Home',        layout: 'bleed', bg: '#111',    panel: '#111',    accentColor: '#D31145', heroImage: 'dinner',  defaults: { eyebrow: 'Life Protection',         headline: 'Here for Every Family Moment',        cta: 'Reserve a chat' } },
  { id: 'life-red-03',     cat: 'life',  name: 'Red Panel',             layout: 'split', bg: '#D31145', panel: '#D31145', accentColor: '#fff',    heroImage: 'toast',   defaults: { eyebrow: 'Whole Life',              headline: 'Protect What Matters Most',           body: 'Lifelong cover that grows with your family, from first home to first grandchild.', cta: 'Book a review' } },
  { id: 'ci-care-01',      cat: 'ci',    name: 'Stronger Together',     layout: 'hero',  bg: '#FFF5F7', panel: '#FFF5F7', accentColor: '#D31145', heroImage: 'couple',  defaults: { eyebrow: 'Critical Illness',        headline: 'Focus on Recovery, Not the Bills',    body: 'A lump sum on diagnosis of covered illnesses, so you can rest and heal.', cta: 'Check your cover' } },
  { id: 'ci-adviser-02',   cat: 'ci',    name: 'Talk to Me',            layout: 'split', bg: '#9A0828', panel: '#9A0828', accentColor: '#fff',    heroImage: 'headshot',defaults: { eyebrow: 'Early Critical Illness',  headline: 'Cover From the Early Stages',         body: 'Support from early diagnosis, when it can make the biggest difference.', cta: 'Talk to me' } },
  { id: 'ci-calm-03',      cat: 'ci',    name: 'Peace of Mind',         layout: 'bleed', bg: '#D31145', panel: '#D31145', accentColor: '#fff',    heroImage: 'couple',  defaults: { eyebrow: 'Critical Illness',        headline: 'Rest Easy, Heal Well',                cta: 'Learn more' } },
  { id: 'ret-chapter-01',  cat: 'ret',   name: 'Next Chapter',          layout: 'bleed', bg: '#111',    panel: '#111',    accentColor: '#D31145', heroImage: 'couple',  defaults: { eyebrow: 'Retirement Planning',     headline: 'Write Your Next Chapter',             cta: 'Reserve your seat' } },
  { id: 'ret-plan-02',     cat: 'ret',   name: 'On Your Terms',         layout: 'hero',  bg: '#F7F8FB', panel: '#F7F8FB', accentColor: '#D31145', heroImage: 'couple',  defaults: { eyebrow: 'Retirement',              headline: 'Retire on Your Terms',                body: 'A clear, personal plan for the retirement you actually want. No jargon, no pressure.', cta: 'Reserve your seat' } },
  { id: 'ret-red-03',      cat: 'ret',   name: 'Time Together',         layout: 'split', bg: '#D31145', panel: '#D31145', accentColor: '#fff',    heroImage: 'dinner',  defaults: { eyebrow: 'Retirement Income',       headline: 'More Time for the People You Love',   body: 'Build steady retirement income today and enjoy the years ahead with family.', cta: 'Book a review' } },
  { id: 'sav-money-01',    cat: 'sav',   name: 'Money Has a Future',    layout: 'split', bg: '#fff',    panel: '#fff',    accentColor: '#D31145', heroImage: 'headshot',defaults: { eyebrow: 'Savings and Investment',  headline: "Your Money Has a Future. Let's Plan It.", body: 'A clear plan that turns steady savings into the goals your family cares about.', cta: 'Start the conversation' } },
  { id: 'sav-goal-02',     cat: 'sav',   name: 'Goals Within Reach',    layout: 'hero',  bg: '#fff',    panel: '#fff',    accentColor: '#D31145', heroImage: 'dinner',  defaults: { eyebrow: 'Savings Plan',            headline: 'Goals Within Reach',                  body: "Plan today for tomorrow's milestones, from the first school day to graduation.", cta: 'Start saving' } },
  { id: 'sav-future-03',   cat: 'sav',   name: 'A Toast to Tomorrow',   layout: 'bleed', bg: '#D31145', panel: '#D31145', accentColor: '#fff',    heroImage: 'toast',   defaults: { eyebrow: 'Education Savings',       headline: 'A Toast to Your Future',              cta: 'Talk to me' } },
  { id: 'event-seminar-01',cat: 'event', name: 'Seminar Invite',        layout: 'split', bg: '#fff',    panel: '#fff',    accentColor: '#D31145', heroImage: 'couple',  defaults: { eyebrow: 'Free seminar',            headline: 'Your Future in Focus',                cta: 'Reserve your seat' } },
  { id: 'event-clarity-02',cat: 'event', name: 'Clarity Session',       layout: 'bleed', bg: '#111',    panel: '#111',    accentColor: '#D31145', heroImage: 'toast',   defaults: { eyebrow: 'Retirement seminar',      headline: 'Plan Your Retirement With Clarity',   cta: 'Save your seat' } },
  { id: 'greet-season-01', cat: 'greet', name: "Season's Warmth",       layout: 'hero',  bg: '#fff',    panel: '#fff',    accentColor: '#D31145', heroImage: 'dinner',  defaults: { eyebrow: "Season's greetings",      headline: 'Sharing the Warmth of the Season',    body: 'Wishing you and your loved ones a season of joy and wonderful moments together.' } },
  { id: 'greet-newyear-02',cat: 'greet', name: 'A Fresh Start',         layout: 'hero',  bg: '#FFF5F7', panel: '#FFF5F7', accentColor: '#D31145', heroImage: 'toast',   defaults: { eyebrow: 'Happy New Year',          headline: "Here's to a Fresh Start",             body: 'Wishing you a new year of joy, health and wonderful new beginnings.' } },
  { id: 'greet-wish-03',   cat: 'greet', name: 'My Wish for You',       layout: 'split', bg: '#D31145', panel: '#D31145', accentColor: '#fff',    heroImage: 'headshot',defaults: { eyebrow: 'Warm wishes',             headline: 'My Wish for You',                     body: 'A new season brings a chance for fresh starts. I look forward to our journey together.' } },
];

export const TPL_MAP = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'ci-month', name: 'Critical Illness Awareness Month', short: 'CI Awareness',
    period: '1 to 31 October 2026', until: '2026-10-31',
    blurb: 'Help clients check whether their cover still fits their life. Three pre-approved posters with your details added.',
    posters: [
      { name: 'Is your cover enough?', tpl: 'ci-care-01',    size: '1080x1080', eyebrow: 'CI Awareness Month', headline: 'Is Your Cover Still Enough?',    body: 'A short review shows whether your critical illness cover still fits your life today.', cta: 'Book a review' },
      { name: 'Rest easy',             tpl: 'ci-calm-03',    size: '1080x1350', eyebrow: 'CI Awareness Month' },
      { name: 'Story: early cover',    tpl: 'ci-adviser-02', size: '1080x1920', eyebrow: 'CI Awareness Month' },
    ],
  },
  {
    id: 'ret-week', name: 'Retirement Readiness Week', short: 'Retirement Week',
    period: '9 to 15 November 2026', until: '2026-11-15',
    blurb: 'Start the retirement conversation with clients in their forties and fifties.',
    posters: [
      { name: 'Retire on your terms', tpl: 'ret-plan-02',    size: '1080x1350', eyebrow: 'Retirement Readiness Week' },
      { name: 'Story: next chapter',  tpl: 'ret-chapter-01', size: '1080x1920', eyebrow: 'Retirement Readiness Week' },
    ],
  },
  {
    id: 'year-end', name: 'Year-end Policy Review', short: 'Year-end Review',
    period: '1 to 31 December 2026', until: '2026-12-31',
    blurb: 'Invite clients to review their cover before the new year.',
    posters: [
      { name: 'Ready for 2027?',          tpl: 'life-red-03',   size: '1080x1350', eyebrow: 'Year-end review', headline: 'Is Your Cover Ready for 2027?', body: 'Book a quick review before December ends and start the new year with the right cover.' },
      { name: 'Landscape for Facebook',   tpl: 'life-focus-01', size: '1200x628',  eyebrow: 'Year-end review', headline: 'Ready for 2027?' },
    ],
  },
];

export const OCCASIONS: Occasion[] = [
  { id: 'midautumn', name: 'Mid-Autumn Festival', date: '2026-09-25', tpl: 'greet-season-01', content: { eyebrow: 'Mid-Autumn Festival', headline: 'Wishing You a Bright Mid-Autumn', body: 'May the full moon bring you and your family togetherness, joy and good health.' } },
  { id: 'deepavali', name: 'Deepavali',            date: '2026-11-08', tpl: 'greet-wish-03',   content: { eyebrow: 'Happy Deepavali',       headline: 'My Deepavali Wish for You',      body: 'Wishing you and your loved ones a festival full of warmth, light and happiness.' } },
  { id: 'christmas', name: 'Christmas',            date: '2026-12-25', tpl: 'greet-season-01', content: { eyebrow: 'Merry Christmas',        headline: 'Sharing the Warmth of the Season', body: 'Wishing you and your loved ones a season of joy and wonderful moments together.' } },
  { id: 'newyear',   name: 'New Year',             date: '2027-01-01', tpl: 'greet-newyear-02',content: { eyebrow: 'Happy New Year',         headline: "Here's to a Fresh Start" } },
  { id: 'cny',       name: 'Chinese New Year',     date: '2027-02-06', tpl: 'greet-wish-03',   content: { eyebrow: 'Happy Chinese New Year', headline: 'Wishing You Prosperity and Health', body: 'May the new year bring you and your loved ones joy, peace and good fortune.' } },
  { id: 'raya',      name: 'Hari Raya Puasa',      date: '2027-03-10', tpl: 'greet-season-01', approx: true, content: { eyebrow: 'Selamat Hari Raya', headline: 'Warm Wishes This Hari Raya', body: 'Wishing you and your family a joyful celebration full of forgiveness and togetherness.' } },
];

function uid() { return Math.random().toString(36).slice(2, 10); }

const now = Date.now();
const H = 3_600_000;
const D = 24 * H;

export const SEED_POSTERS: Poster[] = [
  {
    id: uid(), name: 'Family protection for Instagram',
    status: 'draft', cat: 'life', size: '1080x1350', templateId: 'life-focus-01',
    created: now - 40 * 60_000 - 2 * H, updated: now - 40 * 60_000,
    eyebrow: 'Life Protection', headline: 'Love Them Today, Protect Their Tomorrow',
    body: "Protection that keeps your family's plans on track, whatever tomorrow brings.",
    cta: 'Talk to me',
    versions: [
      { seq: 1, label: 'Generated', source: 'system', at: now - 40 * 60_000 - 2 * H },
    ],
  },
  {
    id: uid(), name: 'Retirement seminar, 17 Oct',
    status: 'approved', cat: 'event', size: '1080x1350', templateId: 'event-seminar-01',
    created: now - 5 * H - 2 * H, updated: now - 5 * H,
    eyebrow: 'Free seminar', headline: 'Your Future in Focus', cta: 'Reserve your seat',
    eventDate: '2026-10-17',
    versions: [
      { seq: 1, label: 'Generated', source: 'system', at: now - 5 * H - 2 * H },
      { seq: 2, label: 'Submitted for review', source: 'system', at: now - 5 * H - H },
      { seq: 3, label: 'Approved by Compliance', source: 'system', at: now - 5 * H, approved: true },
    ],
  },
  {
    id: uid(), name: 'Critical illness check-in',
    status: 'review', cat: 'ci', size: '1080x1080', templateId: 'ci-care-01',
    created: now - D - 2 * H, updated: now - D,
    eyebrow: 'Critical Illness', headline: 'Focus on Recovery, Not the Bills',
    body: 'A lump sum on diagnosis of covered illnesses, so you can rest and heal.',
    cta: 'Check your cover',
    versions: [
      { seq: 1, label: 'Generated', source: 'system', at: now - D - 2 * H },
      { seq: 2, label: 'Submitted for review', source: 'system', at: now - D - H },
    ],
  },
  {
    id: uid(), name: 'Deepavali greeting',
    status: 'approved', cat: 'greet', size: '1080x1350', templateId: 'greet-wish-03',
    created: now - 9 * D - 2 * H, updated: now - 9 * D,
    eyebrow: 'Happy Deepavali', headline: 'My Deepavali Wish for You',
    body: 'Wishing you and your loved ones a festival full of warmth, light and happiness.',
    versions: [
      { seq: 1, label: 'Generated', source: 'system', at: now - 9 * D - 2 * H },
      { seq: 2, label: 'Submitted for review', source: 'system', at: now - 9 * D - H },
      { seq: 3, label: 'Approved by Compliance', source: 'system', at: now - 9 * D, approved: true },
    ],
  },
  {
    id: uid(), name: 'Savings conversation',
    status: 'draft', cat: 'sav', size: '1080x1080', templateId: 'sav-money-01',
    created: now - 3 * D - 2 * H, updated: now - 3 * D,
    eyebrow: 'Savings and Investment', headline: "Your Money Has a Future. Let's Plan It.",
    body: 'A clear plan that turns steady savings into the goals your family cares about.',
    cta: 'Start the conversation',
    versions: [{ seq: 1, label: 'Generated', source: 'system', at: now - 3 * D - 2 * H }],
  },
  {
    id: uid(), name: 'Year-end review reminder',
    status: 'draft', cat: 'life', size: '1200x628', templateId: 'life-red-03',
    created: now - 6 * D - 2 * H, updated: now - 6 * D,
    eyebrow: 'Year-end review', headline: 'Is Your Cover Ready for 2027?',
    body: 'Book a quick review before December and start the new year with the right cover.',
    cta: 'Book a review',
    versions: [{ seq: 1, label: 'Generated', source: 'system', at: now - 6 * D - 2 * H }],
  },
];

export function daysTo(iso: string): number {
  const d = new Date(iso + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export function fmtShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function fmtDayMonth(iso: string): string {
  return fmtShort(iso);
}

export function relTime(ts: number): string {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return Math.floor(d / 60) + ' min ago';
  if (d < 86400) return Math.floor(d / 3600) + ' h ago';
  if (d < 172800) return 'yesterday';
  if (d < 604800) return Math.floor(d / 86400) + ' days ago';
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function upcomingOccasions(n: number): (Occasion & { days: number })[] {
  return OCCASIONS
    .map((o) => ({ ...o, days: daysTo(o.date) }))
    .filter((o) => o.days >= 0)
    .slice(0, n);
}

export function statusKey(p: Poster): string {
  if (p.status === 'approved' && p.eventDate && daysTo(p.eventDate) < 0) return 'past';
  if (p.status === 'approved' && p.shares) return 'shared';
  return p.status;
}
