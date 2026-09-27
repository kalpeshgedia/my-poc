'use client';
import { KIT_GROUPS, EXTRA } from '../_constants';

export default function AddPanel({ onClose, onAdd }: { onClose: () => void; onAdd: (kind: string) => void }) {
  return (
    <div className="add-panel-overlay">
      <div className="add-panel-drag-handle" />
      <div className="add-panel-scroll">
        {KIT_GROUPS.map(([group, kinds]) => (
          <div key={group}>
            <div className="add-cat-label">{group}</div>
            <div className="add-grid">
              {kinds.map((kind) => {
                const d = EXTRA[kind];
                return (
                  <button key={kind} className="add-item" onClick={() => { onAdd(kind); onClose(); }} title={d.hint}>
                    <div className="add-item-label">{d.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="add-footer">Nothing may cover the logo or disclaimer.</div>
    </div>
  );
}
