import { Poster } from '@/lib/mockData';

export const SLOT_META: Record<string, { label: string; field: keyof Poster; maxChars: number; rows?: number; isText?: boolean }> = {
  eyebrow:  { label: 'Eyebrow',         field: 'eyebrow',  maxChars: 28 },
  headline: { label: 'Headline',         field: 'headline', maxChars: 48, rows: 3, isText: true },
  body:     { label: 'Body copy',        field: 'body',     maxChars: 120, rows: 4, isText: true },
  cta:      { label: 'Call to action',   field: 'cta',      maxChars: 22 },
};

export const TEXT_COLORS = [
  { id: 'auto',    label: 'Auto' },
  { id: '#D31145', label: 'AIA Red' },
  { id: '#161E2E', label: 'Ink' },
  { id: '#9A0828', label: 'Dark Red' },
  { id: '#F0A0B0', label: 'Rose' },
  { id: '#F7D0D8', label: 'Light Rose' },
  { id: '#5B6472', label: 'Slate' },
  { id: '#D4A200', label: 'Gold' },
  { id: '#2E8B4E', label: 'Green' },
  { id: '#2563EB', label: 'Blue' },
];

export const AI_REWRITES: Record<string, string[]> = {
  headline: ['Protect What Matters Most', 'Your Family, Secured for Life', 'Plan Today. Live Fully Tomorrow.', 'Life Cover for Every Chapter'],
  body:     ['Safeguard your family\'s tomorrow, starting today.', 'Comprehensive protection for the ones you love.', 'Because every family deserves a safety net.', 'Trusted coverage, built around your needs.'],
  eyebrow:  ['LIFE PROTECTION', 'FAMILY COVERAGE', 'PROTECTION PLAN', 'LIFE INSURANCE'],
  cta:      ['Talk to me', 'Learn more', 'Get protected', 'Find out more'],
};

// Matches HTML's EXTRA object — 24 addable element types
export const EXTRA: Record<string, { label: string; hint: string; type: string; fill?: boolean; textColor?: boolean }> = {
  heading:   { type: 'text',    label: 'Heading',       hint: 'Big display line',                       textColor: true },
  text:      { type: 'text',    label: 'Text box',       hint: 'Short supporting line',                  textColor: true },
  checklist: { type: 'list',    label: 'Checklist',      hint: '3 or 4 points with ticks',               fill: true },
  callout:   { type: 'card',    label: 'Callout box',    hint: '"Did you know?" and one line',            fill: true },
  stat:      { type: 'card',    label: 'Big number',     hint: 'A number with a short label',             fill: true },
  signature: { type: 'text',    label: 'Signature',      hint: 'Handwritten sign-off',                   textColor: true },
  event:     { type: 'event',   label: 'Event details',  hint: 'Date, time and venue' },
  datebadge: { type: 'card',    label: 'Date badge',     hint: 'Big day and month',                      fill: true },
  agenda:    { type: 'list',    label: 'Agenda',         hint: 'Times and topics for an event',          fill: true },
  speaker:   { type: 'card',    label: 'Speaker card',   hint: 'Photo, name and title',                  fill: true },
  qr:        { type: 'qr',      label: 'QR code',        hint: 'Links to your sign-up page' },
  adviser:   { type: 'adviser', label: 'Adviser card',   hint: 'Your name and number' },
  contact:   { type: 'contact', label: 'Contact bar',    hint: 'WhatsApp or call me, from your profile', fill: true },
  badge:     { type: 'text',    label: 'Badge',          hint: 'Tilted pill callout',                    fill: true },
  sticker:   { type: 'text',    label: 'Sticker',        hint: 'Starburst, a few words',                 fill: true },
  ribbon:    { type: 'card',    label: 'Corner ribbon',  hint: 'A band across a corner',                 fill: true },
  icon:      { type: 'icon',    label: 'Icon',           hint: 'Ten brand icons',                        fill: true },
  line:      { type: 'shape',   label: 'Line',           hint: 'Accent rule or underline',               fill: true },
  frame:     { type: 'frame',   label: 'Poster frame',   hint: 'A border around the whole poster' },
  rect:      { type: 'shape',   label: 'Rectangle',      hint: 'Rounded colour block',                   fill: true },
  circle:    { type: 'shape',   label: 'Circle',         hint: 'Colour blob behind text',                fill: true },
  arrow:     { type: 'shape',   label: 'Arrow',          hint: 'Point at the button',                    fill: true },
  photo:     { type: 'photo',   label: 'Photo',          hint: 'Round photo with a border' },
};

// Matches HTML's KIT_GROUPS array
export const KIT_GROUPS: [string, string[]][] = [
  ['Text',                       ['heading', 'text', 'checklist', 'callout', 'stat', 'signature']],
  ['Event',                      ['event', 'datebadge', 'agenda', 'speaker', 'qr']],
  ['You',                        ['adviser', 'contact']],
  ['Badges and icons',           ['badge', 'sticker', 'ribbon', 'icon']],
  ['Lines, shapes and frames',   ['line', 'frame', 'rect', 'circle', 'arrow']],
  ['Pictures',                   ['photo']],
];

export const MAX_EXTRAS = 16;
