'use client';
import { SLOT_META } from '../_constants';
import { SlotStyle, InspTab } from '../_types';
import { IconAlignLeft, IconAlignCenter, IconAlignRight, IconSpark, IconTrash } from '../_icons';

export default function SlotToolbar({ selectedSlot, updateSlotStyle, handleFieldChange, setSelectedSlot, setInspTab, setInspOpen }: {
  selectedSlot: string | null;
  updateSlotStyle: (slot: string, p: Partial<SlotStyle>) => void;
  handleFieldChange: (field: string, val: string) => void;
  setSelectedSlot: (s: string | null) => void;
  setInspTab: (t: InspTab) => void;
  setInspOpen: (v: boolean) => void;
}) {
  if (!selectedSlot || !SLOT_META[selectedSlot]) return null;
  return (
    <div className="slot-toolbar">
      <span className="slot-toolbar-label">{SLOT_META[selectedSlot]?.label}</span>
      <div className="slot-toolbar-sep" />
      <button className="slot-toolbar-btn" title="Align left" onClick={() => updateSlotStyle(selectedSlot, { align: 'left' })}><IconAlignLeft /></button>
      <button className="slot-toolbar-btn" title="Align center" onClick={() => updateSlotStyle(selectedSlot, { align: 'center' })}><IconAlignCenter /></button>
      <button className="slot-toolbar-btn" title="Align right" onClick={() => updateSlotStyle(selectedSlot, { align: 'right' })}><IconAlignRight /></button>
      <div className="slot-toolbar-sep" />
      <button className="slot-toolbar-btn slot-toolbar-ai" title="Rewrite with AI" onClick={() => { setInspTab('properties'); setInspOpen(true); }}>
        <IconSpark size={12} /> AI
      </button>
      <div className="slot-toolbar-sep" />
      <button className="slot-toolbar-btn slot-toolbar-del" title="Remove" onClick={() => { handleFieldChange(selectedSlot, ''); setSelectedSlot(null); }}><IconTrash /></button>
    </div>
  );
}
