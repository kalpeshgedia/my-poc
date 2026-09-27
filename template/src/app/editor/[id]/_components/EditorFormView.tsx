'use client';

export default function EditorFormView({ headline, body, eyebrow, cta, onChange }: {
  headline: string; body: string; eyebrow: string; cta: string;
  onChange: (field: string, val: string) => void;
}) {
  const fields = [
    { slot: 'eyebrow', label: 'Eyebrow', val: eyebrow, maxChars: 28 },
    { slot: 'headline', label: 'Headline', val: headline, maxChars: 48, rows: 3 },
    { slot: 'body', label: 'Body copy', val: body, maxChars: 120, rows: 5 },
    { slot: 'cta', label: 'Call to action', val: cta, maxChars: 22 },
  ];
  return (
    <div className="editor-form-view">
      <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)' }}>Edit all text in one place. Changes update the canvas live.</p>
      {fields.map((f) => (
        <div key={f.slot} className="field">
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            {f.label}
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: f.val.length > f.maxChars ? 'var(--bad)' : 'var(--ink-3)' }}>{f.val.length}/{f.maxChars}</span>
          </label>
          {f.rows
            ? <textarea rows={f.rows} value={f.val} onChange={(e) => onChange(f.slot, e.target.value)} maxLength={f.maxChars + 5} />
            : <input type="text" value={f.val} onChange={(e) => onChange(f.slot, e.target.value)} maxLength={f.maxChars + 5} />
          }
        </div>
      ))}
    </div>
  );
}
