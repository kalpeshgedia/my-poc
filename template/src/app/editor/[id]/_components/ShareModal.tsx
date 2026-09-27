'use client';
import { useState } from 'react';
import { Poster } from '@/lib/mockData';
import { IconCheck, IconSend } from '@/components/ui/Icons';
import { IconX } from '../_icons';

export default function ShareModal({ poster, onClose, onShared }: { poster: Poster; onClose: () => void; onShared: () => void }) {
  const [channel, setChannel] = useState('whatsapp');
  const [sending, setSending] = useState(false);
  const channels = [
    { id: 'whatsapp',  emoji: '💬', label: 'WhatsApp',      desc: 'Send directly to clients' },
    { id: 'instagram', emoji: '📸', label: 'Instagram',     desc: 'Post or Story' },
    { id: 'facebook',  emoji: '👍', label: 'Facebook',      desc: 'Post or Messenger' },
    { id: 'linkedin',  emoji: '💼', label: 'LinkedIn',      desc: 'Professional network' },
    { id: 'download',  emoji: '⬇️', label: 'Download PNG',  desc: 'Save to device' },
  ];
  function handleShare() {
    setSending(true);
    setTimeout(() => { setSending(false); onShared(); onClose(); }, 1400);
  }
  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal share-modal" role="dialog" aria-modal="true">
        <header>
          <h3>Share &quot;{poster.name}&quot;</h3>
          <button className="iconbtn ghosticon" onClick={onClose}><IconX /></button>
        </header>
        <div className="share-modal mbody">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)' }}>Approved by Compliance. Choose where to share it.</p>
          {channels.map((c) => (
            <button key={c.id} className="share-channel" aria-pressed={channel === c.id} onClick={() => setChannel(c.id)}>
              <div className="sc-ico">{c.emoji}</div>
              <div><b>{c.label}</b><small>{c.desc}</small></div>
              {channel === c.id && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}><IconCheck /></span>}
            </button>
          ))}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={handleShare} disabled={sending}>
              {sending ? 'Sharing…' : <><IconSend size={13} /> Share via {channels.find(c => c.id === channel)?.label}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
