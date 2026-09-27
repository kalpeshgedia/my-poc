export type LeftPanel = 'templates' | 'add' | null;
export type InspTab = 'properties' | 'layers' | 'checks' | 'history';
export type EditorView = 'canvas' | 'form';
export type PreviewTab = 'whatsapp' | 'instagram-feed' | 'instagram-story' | 'glance';
export type TextSize = 'small' | 'medium' | 'large';
export type TextAlign = 'left' | 'center' | 'right';
export type FontId = 'instrument' | 'manrope' | 'fraunces';

export interface SlotStyle {
  font: FontId;
  size: TextSize;
  align: TextAlign;
  color: string;
}

export interface ExtraElement {
  id: string;
  kind: string;
  x: number;
  y: number;
  rot?: number;
  scale?: number;
  color?: string;
  text?: string;
}
