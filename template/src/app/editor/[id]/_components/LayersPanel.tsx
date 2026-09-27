'use client';
import { ExtraElement } from '../_types';
import { EXTRA } from '../_constants';

interface Props {
  selectedSlot: string | null;
  selectedExtra: string | null;
  eyebrow: string; headline: string; body: string; cta: string;
  extras: ExtraElement[];
  onSelect: (s: string) => void;
  onSelectExtra: (id: string) => void;
}

export default function LayersPanel({ selectedSlot, selectedExtra, eyebrow, headline, body, cta, extras, onSelect, onSelectExtra }: Props) {
  const baseSlots = [
    { slot: 'headline',   label: 'Headline',  preview: headline },
    { slot: 'eyebrow',    label: 'Eyebrow',   preview: eyebrow },
    ...(body ? [{ slot: 'body', label: 'Body copy', preview: body }] : []),
    ...(cta  ? [{ slot: 'cta',  label: 'CTA',       preview: cta  }] : []),
    { slot: 'heroImage',  label: 'Photo',      preview: '' },
    { slot: 'disclaimer', label: 'Disclaimer', preview: '' },
    { slot: 'logo',       label: 'AIA logo',   preview: '' },
  ];

  const rowStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: 0, borderRadius: 8,
    padding: '8px 14px', cursor: 'pointer', fontSize: 13, textAlign: 'left',
    background: active ? 'var(--accent-soft)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--ink)',
  });

  return (
    <ul style={{ margin: 0, padding: '8px 0', listStyle: 'none' }}>
      {/* Added (extra) elements */}
      {extras.map((ex) => {
        const def = EXTRA[ex.kind];
        const active = selectedExtra === ex.id;
        return (
          <li key={ex.id}>
            <button style={rowStyle(active)} onClick={() => onSelectExtra(ex.id)}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: active ? 'var(--accent)' : 'var(--ink-3)', minWidth: 60, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {def?.label.slice(0, 9) || ex.kind}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: active ? 'var(--accent)' : 'var(--ink-2)', fontSize: 12 }}>
                {def?.hint || ex.kind}
              </span>
              <span style={{ fontSize: 10, background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 4, padding: '1px 5px', color: 'var(--ink-3)', flexShrink: 0 }}>added</span>
            </button>
          </li>
        );
      })}

      {extras.length > 0 && (
        <li style={{ height: 1, background: 'var(--line-2)', margin: '4px 14px' }} aria-hidden />
      )}

      {/* Template slots */}
      {baseSlots.map((l) => {
        const active = selectedSlot === l.slot;
        const canEdit = l.preview !== undefined && !['heroImage', 'disclaimer', 'logo'].includes(l.slot);
        return (
          <li key={l.slot}>
            <button
              style={rowStyle(active)}
              onClick={() => canEdit ? onSelect(l.slot) : undefined}
              disabled={!canEdit}
            >
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: active ? 'var(--accent)' : 'var(--ink-3)', minWidth: 60, flexShrink: 0 }}>{l.label}</span>
              {canEdit
                ? <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: active ? 'var(--accent)' : 'var(--ink-2)' }}>{l.preview.slice(0, 30)}{l.preview.length > 30 ? '…' : ''}</span>
                : <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>non-editable</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
