'use client';
import { Poster } from '@/lib/mockData';
import { LeftPanel } from '../_types';
import { IconX } from '../_icons';
import TemplatesDrawer from './TemplatesDrawer';

export default function EditorLeftDrawer({ leftPanel, setLeftPanel, poster }: {
  leftPanel: LeftPanel;
  setLeftPanel: (v: LeftPanel) => void;
  poster: Poster;
}) {
  if (!leftPanel || leftPanel === 'add') return null;
  return (
    <div className="editor-ldrawer" style={{ top: 41 }}>
      {leftPanel === 'templates' && (
        <TemplatesDrawer poster={poster} onClose={() => setLeftPanel(null)} />
      )}
    </div>
  );
}
