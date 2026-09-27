'use client';
import { useState, useEffect, useRef, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PosterCanvas from '@/components/ui/PosterCanvas';
import { useApp } from '@/lib/store';
import { Poster, SIZES, TPL_MAP } from '@/lib/mockData';
import { IconCheck } from '@/components/ui/Icons';
import { LeftPanel, InspTab, EditorView, SlotStyle, ExtraElement } from './_types';
import { EXTRA, MAX_EXTRAS } from './_constants';
import { IconX, IconPlus2 } from './_icons';
import EditorTopBar from './_components/EditorTopBar';
import EditorLeftRail from './_components/EditorLeftRail';
import EditorRightRail from './_components/EditorRightRail';
import EditorLeftDrawer from './_components/EditorLeftDrawer';
import EditorInspector from './_components/EditorInspector';
import SlotToolbar from './_components/SlotToolbar';
import PreviewModal from './_components/PreviewModal';
import ShareModal from './_components/ShareModal';
import AddDialog from './_components/AddDialog';
import ExtrasOverlay from './_components/ExtrasOverlay';
import EditorFormView from './_components/EditorFormView';

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { posters, setPosters, showToast } = useApp();

  const poster = posters.find((p) => p.id === id);

  const [name, setName] = useState(poster?.name || '');
  const [headline, setHeadline] = useState(poster?.headline || '');
  const [body, setBody] = useState(poster?.body || '');
  const [eyebrow, setEyebrow] = useState(poster?.eyebrow || '');
  const [cta, setCta] = useState(poster?.cta || '');
  const tplForHero = poster ? TPL_MAP[poster.templateId] : null;
  const [heroImage, setHeroImage] = useState(poster?.heroImage || tplForHero?.heroImage || 'couple');

  const [leftPanel, setLeftPanel] = useState<LeftPanel>(null);
  const [inspTab, setInspTab] = useState<InspTab>('properties');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [editorView, setEditorView] = useState<EditorView>('canvas');

  const [showShare, setShowShare] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [saved, setSaved] = useState(true);
  const [inspOpen, setInspOpen] = useState(true);
  const [extras, setExtras] = useState<ExtraElement[]>([]);
  const [selectedExtra, setSelectedExtra] = useState<string | null>(null);
  const extraSeq = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [slotStyles, setSlotStyles] = useState<Record<string, SlotStyle>>({});

  const getSlotStyle = useCallback((slot: string): SlotStyle => {
    const s = slotStyles[slot];
    return {
      font:  s?.font  ?? 'instrument',
      size:  s?.size  ?? 'medium',
      align: s?.align ?? 'left',
      color: s?.color ?? 'auto',
    };
  }, [slotStyles]);

  const updateSlotStyle = (slot: string, partial: Partial<SlotStyle>) => {
    setSlotStyles((prev) => ({ ...prev, [slot]: { ...getSlotStyle(slot), ...partial } }));
  };

  // Scale calculation
  useEffect(() => {
    if (!poster) return;
    const sz = SIZES[poster.size];
    const compute = () => {
      if (!stageRef.current) return;
      const { width, height } = stageRef.current.getBoundingClientRect();
      const s = Math.min((width - 80) / sz.w, (height - 80) / sz.h, 0.72);
      setScale(Math.round(s * 1000) / 1000);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [poster?.size]);

  // Sync from poster on id change
  useEffect(() => {
    if (poster) {
      setName(poster.name);
      setHeadline(poster.headline);
      setBody(poster.body || '');
      setEyebrow(poster.eyebrow);
      setCta(poster.cta || '');
      const t = TPL_MAP[poster.templateId];
      setHeroImage(poster.heroImage || t?.heroImage || 'couple');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Close pop menus on outside click
  useEffect(() => {
    if (!showMoreMenu && !showSizeMenu) return;
    const close = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.pop-menu')) return;
      setShowMoreMenu(false); setShowSizeMenu(false);
    };
    document.addEventListener('mousedown', close, true);
    return () => document.removeEventListener('mousedown', close, true);
  }, [showMoreMenu, showSizeMenu]);

  // Keyboard shortcuts: A=add, Escape=close panels
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'a' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setShowAddDialog((v) => !v);
        return;
      }
      if (e.key === 'Escape') {
        setShowMoreMenu(false); setShowSizeMenu(false);
        if (showAddDialog) { setShowAddDialog(false); return; }
        if (leftPanel) { setLeftPanel(null); return; }
        if (inspOpen && selectedSlot) { setSelectedSlot(null); return; }
        if (inspOpen) { setInspOpen(false); return; }
      }
      if ((e.key === 'z' || e.key === 'Z') && (e.metaKey || e.ctrlKey)) {
        showToast('Undo — version history coming soon.');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Auto-save
  const commit = useCallback((updates: Partial<Poster>) => {
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setPosters(posters.map((p) => p.id === id ? { ...p, ...updates, updated: Date.now() } : p));
      setSaved(true);
    }, 600);
  }, [id, posters, setPosters]);

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'headline') { setHeadline(val); commit({ headline: val }); }
    else if (field === 'body')     { setBody(val);     commit({ body: val }); }
    else if (field === 'eyebrow')  { setEyebrow(val);  commit({ eyebrow: val }); }
    else if (field === 'cta')      { setCta(val);       commit({ cta: val }); }
  };

  const handleNameChange = (v: string) => {
    setName(v);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setPosters(posters.map((p) => p.id === id ? { ...p, name: v, updated: Date.now() } : p));
      setSaved(true);
    }, 800);
  };

  const handleSubmitForReview = () => {
    setPosters(posters.map((p) =>
      p.id === id ? { ...p, status: 'review', updated: Date.now(),
        versions: [...p.versions, { seq: p.versions.length + 1, label: 'Submitted for review', source: 'user', at: Date.now() }],
      } : p
    ));
    showToast('Submitted for review. Compliance usually replies within one working day.', 4500);
    setShowSubmitConfirm(false);
    router.push('/posters');
  };

  const handleShared = () => {
    setPosters(posters.map((p) => p.id === id ? { ...p, shares: (p.shares || 0) + 1, updated: Date.now() } : p));
    showToast('Shared successfully (simulated).');
  };

  const handleAddExtra = (kind: string) => {
    if (extras.length >= MAX_EXTRAS) { showToast(`A poster can hold up to ${MAX_EXTRAS} added elements.`); return; }
    const n = extras.length;
    const stagger = (n % 5) * 40;
    const id2 = `${kind}_${++extraSeq.current}`;
    const newExtra: ExtraElement = { id: id2, kind, x: 60 + stagger, y: 60 + stagger };
    if (kind === 'badge') newExtra.rot = -6;
    if (kind === 'sticker') newExtra.rot = 8;
    setExtras((prev) => [...prev, newExtra]);
    setSelectedExtra(id2);
    setInspTab('properties');
    setInspOpen(true);
    showToast(`${EXTRA[kind]?.label || kind} added. Click to select, drag to move.`, 3000);
  };

  const handleRemoveExtra = (eid: string) => {
    setExtras((prev) => prev.filter((e) => e.id !== eid));
    if (selectedExtra === eid) setSelectedExtra(null);
  };

  const handleMoveExtra = (eid: string, x: number, y: number) => {
    setExtras((prev) => prev.map((e) => e.id === eid ? { ...e, x, y } : e));
  };

  const handleScaleExtra = (eid: string, s: number) => {
    setExtras((prev) => prev.map((e) => e.id === eid ? { ...e, scale: s } : e));
  };

  const handleRotateExtra = (eid: string, rot: number) => {
    setExtras((prev) => prev.map((e) => e.id === eid ? { ...e, rot } : e));
  };

  const handleHeroImageChange = (key: string) => {
    setHeroImage(key);
    commit({ heroImage: key });
  };

  if (!poster) {
    return (
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p style={{ color: 'var(--ink-2)' }}>Poster not found.</p>
          <Link href="/posters" className="btn primary" style={{ textDecoration: 'none' }}>Back to My posters</Link>
        </div>
      </div>
    );
  }

  const livePoster: Poster = { ...poster, headline, body, eyebrow, cta, name, heroImage };
  const sz = SIZES[poster.size];
  const checksOk = headline.length <= 48 && (body.length === 0 || body.length <= 120);

  const handleRrailClick = (tab: InspTab) => {
    if (inspTab === tab && inspOpen) { setInspOpen(false); }
    else { setInspTab(tab); setInspOpen(true); }
  };

  return (
    <div className="editor-app">

      {/* ── Top bar ── */}
      <EditorTopBar
        name={name}
        onNameChange={handleNameChange}
        poster={poster}
        sz={sz}
        checksOk={checksOk}
        saved={saved}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
        showSizeMenu={showSizeMenu}
        setShowSizeMenu={setShowSizeMenu}
        onPreview={() => setShowPreview(true)}
        onShare={() => setShowShare(true)}
        onSubmit={() => setShowSubmitConfirm(true)}
        onChecksClick={() => { handleRrailClick('checks'); setSelectedSlot(null); }}
        handleRrailClick={handleRrailClick}
        showToast={showToast}
        livePoster={livePoster}
      />

      {/* ── Left rail ── */}
      <EditorLeftRail
        leftPanel={leftPanel}
        setLeftPanel={setLeftPanel}
        inspOpen={inspOpen}
        inspTab={inspTab}
        checksOk={checksOk}
        handleRrailClick={handleRrailClick}
        onOpenAdd={() => setShowAddDialog(true)}
      />

      {/* ── Center stage ── */}
      <main className="editor-stage" onClick={(e) => { if ((e.target as HTMLElement) === e.currentTarget) { setShowMoreMenu(false); setShowSizeMenu(false); } }}>
        {/* Canvas / Form view tabs */}
        <div className="editor-view-tabs">
          <button aria-selected={editorView === 'canvas'} onClick={() => setEditorView('canvas')}>Canvas</button>
          <button aria-selected={editorView === 'form'} onClick={() => setEditorView('form')}>Form</button>
        </div>

        {/* Left drawer — Templates or Add elements */}
        <EditorLeftDrawer
          leftPanel={leftPanel}
          setLeftPanel={setLeftPanel}
          poster={poster}
        />

        {editorView === 'canvas' ? (
          <>
            <div
              className={`editor-stage-inner${inspOpen ? ' has-insp' : ''}`}
              ref={stageRef}
              onClick={(e) => { if ((e.target as HTMLElement).classList.contains('editor-stage-inner')) setSelectedSlot(null); }}
            >
              {/* Floating toolbar — appears above canvas when a slot is selected */}
              <SlotToolbar
                selectedSlot={selectedSlot}
                updateSlotStyle={updateSlotStyle}
                handleFieldChange={handleFieldChange}
                setSelectedSlot={setSelectedSlot}
                setInspTab={setInspTab}
                setInspOpen={setInspOpen}
              />

              <div className="editor-frame" style={{ position: 'relative' }}>
                <div className="editor-size-tag">{sz.w} × {sz.h} px · shown at {Math.round(scale * 100)}%</div>
                {poster.status === 'approved' && (
                  <div className="editor-preview-tag">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    APPROVED
                  </div>
                )}
                <PosterCanvas
                  poster={livePoster}
                  scale={scale}
                  selectedSlot={selectedSlot}
                  onSlotClick={(slot) => { setSelectedSlot(slot); setSelectedExtra(null); setInspTab('properties'); setLeftPanel(null); setInspOpen(true); }}
                  interactive
                />
                {/* Added elements overlay */}
                <ExtrasOverlay
                  extras={extras}
                  selectedExtra={selectedExtra}
                  onSelect={(eid) => { setSelectedExtra(eid); setSelectedSlot(null); setInspTab('properties'); setInspOpen(true); }}
                  onMove={handleMoveExtra}
                  scale={scale}
                />
              </div>
            </div>

            <div className="editor-foot" style={{ paddingRight: inspOpen ? 380 : 32 }}>
              <button className="editor-addfab" aria-expanded={showAddDialog} onClick={() => setShowAddDialog((v) => !v)}>
                <IconPlus2 /> Add to poster
              </button>
              <span className="editor-hint">Click anything on the poster to change it. <kbd style={{ fontFamily: 'var(--mono)', fontSize: 10.5, border: '1px solid var(--line)', background: 'var(--panel)', borderRadius: 4, padding: '1px 5px' }}>A</kbd> to add elements.</span>
            </div>
          </>
        ) : (
          <EditorFormView headline={headline} body={body} eyebrow={eyebrow} cta={cta} onChange={handleFieldChange} />
        )}

        {/* Add dialog (modal) */}
        {showAddDialog && (
          <AddDialog
            extras={extras}
            onClose={() => setShowAddDialog(false)}
            onAdd={handleAddExtra}
          />
        )}

        {/* ── Inspector ── */}
        <EditorInspector
          inspTab={inspTab}
          setInspTab={setInspTab}
          inspOpen={inspOpen}
          setInspOpen={setInspOpen}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          selectedExtra={selectedExtra}
          setSelectedExtra={setSelectedExtra}
          extras={extras}
          onRemoveExtra={handleRemoveExtra}
          onScaleExtra={handleScaleExtra}
          onRotateExtra={handleRotateExtra}
          poster={poster}
          livePoster={livePoster}
          name={name}
          headline={headline}
          body={body}
          eyebrow={eyebrow}
          cta={cta}
          sz={sz}
          getSlotStyle={getSlotStyle}
          updateSlotStyle={updateSlotStyle}
          handleFieldChange={handleFieldChange}
          heroImageKey={heroImage}
          onHeroImageChange={handleHeroImageChange}
        />
      </main>

      {/* ── Right rail ── */}
      <EditorRightRail
        inspOpen={inspOpen}
        inspTab={inspTab}
        checksOk={checksOk}
        handleRrailClick={handleRrailClick}
      />

      {/* ── Modals ── */}
      {showPreview && <PreviewModal poster={livePoster} onClose={() => setShowPreview(false)} />}

      {showShare && (
        <ShareModal poster={livePoster} onClose={() => setShowShare(false)} onShared={handleShared} />
      )}

      {showSubmitConfirm && (
        <div className="scrim" onClick={(e) => e.target === e.currentTarget && setShowSubmitConfirm(false)}>
          <div className="modal" style={{ maxWidth: 420 }} role="dialog" aria-modal="true">
            <header>
              <h3>Submit for review?</h3>
              <button className="iconbtn ghosticon" onClick={() => setShowSubmitConfirm(false)}><IconX /></button>
            </header>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Compliance will review <b>&quot;{name}&quot;</b> and usually replies within one working day. You won&apos;t be able to edit it while it&apos;s under review.
              </p>
              {!checksOk && (
                <div style={{ background: 'var(--warn-soft)', color: 'var(--warn)', borderRadius: 10, padding: '10px 12px', fontSize: 13 }}>
                  <b>Some checks did not pass.</b> You can still submit, but fixing them first may speed up approval.
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn" onClick={() => setShowSubmitConfirm(false)}>Cancel</button>
                <button className="btn primary" onClick={handleSubmitForReview}>
                  <IconCheck size={13} /> Submit for review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
