'use client';
import { Poster, TPL_MAP, SIZES } from '@/lib/mockData';

const PHOTO_URLS: Record<string, string> = {
  couple:  'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=1080&q=85',
  toast:   'https://images.unsplash.com/photo-1555685812-4b8f286d4b6c?w=1080&q=85',
  dinner:  'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1080&q=85',
  headshot:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1080&q=85',
};

interface Props {
  poster: Poster;
  scale: number;
  selectedSlot?: string | null;
  onSlotClick?: (slot: string) => void;
  interactive?: boolean;
}

export default function PosterCanvas({ poster, scale, selectedSlot, onSlotClick, interactive }: Props) {
  const tpl = TPL_MAP[poster.templateId];
  const sz = SIZES[poster.size];
  const W = sz.w * scale;
  const H = sz.h * scale;

  if (!tpl) return null;

  const isBleed = tpl.layout === 'bleed';
  const isSplit = tpl.layout === 'split';
  const isHero  = tpl.layout === 'hero';
  const isRed   = tpl.bg === '#D31145' || tpl.bg === '#9A0828';
  const isDark  = tpl.bg === '#111' || tpl.bg === '#1a1a2e';

  const photoKey = tpl.heroImage || 'couple';
  const photoUrl = PHOTO_URLS[photoKey] || PHOTO_URLS.couple;

  // Derived text colors
  const textOnDark = isBleed || isRed;
  const panelBg = isRed ? tpl.bg : (isDark ? '#1a1a2e' : (tpl.bg || '#fff'));
  const eyebrowColor = textOnDark ? 'rgba(255,255,255,0.75)' : '#8A93A2';
  const headlineColor = textOnDark ? '#FFFFFF' : '#D31145';
  const bodyColor = textOnDark ? 'rgba(255,255,255,0.88)' : '#5B6472';
  const ctaBg = textOnDark ? '#FFFFFF' : '#D31145';
  const ctaText = textOnDark ? '#D31145' : '#FFFFFF';
  const discColor = textOnDark ? 'rgba(255,255,255,0.6)' : '#8A93A2';

  // Font sizes scale with canvas size
  const fBase = sz.kind === 'wide' ? 48 : sz.kind === 'square' ? 70 : sz.kind === 'story' ? 86 : 80;
  const fH = fBase * scale;
  const fEye = (sz.kind === 'wide' ? 15 : 22) * scale;
  const fBody = (sz.kind === 'wide' ? 20 : 33) * scale;
  const fCta = (sz.kind === 'wide' ? 18 : 32) * scale;
  const fDisc = 16 * scale;
  const fLogo = 30 * scale;

  const pad = 72 * scale;
  const padV = 52 * scale;

  // Layout regions
  const imageH = isHero
    ? (sz.kind === 'wide' ? H : H * (sz.kind === 'story' ? 0.44 : sz.kind === 'tall' ? 0.5 : 0.44))
    : (isSplit
      ? (sz.kind === 'wide' ? H : sz.kind === 'square' ? H : H * 0.5)
      : H);

  const slot = (name: string) => ({
    outline: selectedSlot === name ? `${2.5 * scale}px solid #D31145` : (interactive ? undefined : undefined),
    outlineOffset: selectedSlot === name ? `${3 * scale}px` : undefined,
    cursor: interactive ? 'pointer' : 'default',
    borderRadius: 2 * scale,
  });

  const click = (name: string) => interactive && onSlotClick ? () => onSlotClick(name) : undefined;

  return (
    <div
      style={{
        width: W, height: H,
        position: 'relative',
        overflow: 'hidden',
        background: panelBg,
        fontFamily: "'Instrument Sans', 'Helvetica Neue', Arial, sans-serif",
        userSelect: 'none',
      }}
    >
      {/* ── HERO layout ─────────────────────────────────── */}
      {isHero && (
        <>
          {/* Top image zone */}
          <div
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: imageH, overflow: 'hidden', ...slot('heroImage') }}
            onClick={click('heroImage')}
          >
            <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', display: 'block' }} />
            {/* Top fade for logo readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 45%)' }} />
          </div>

          {/* AIA logo */}
          <div style={{ position: 'absolute', top: 56 * scale, left: 64 * scale, color: '#FFFFFF', fontSize: fLogo, fontWeight: 800, letterSpacing: '0.04em', fontFamily: 'serif', zIndex: 2 }}>AIA</div>

          {/* Text column */}
          <div style={{ position: 'absolute', top: imageH + padV, left: pad, right: pad, display: 'flex', flexDirection: 'column', gap: 14 * scale }}>
            <div style={{ ...slot('eyebrow'), fontSize: fEye, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: eyebrowColor }} onClick={click('eyebrow')}>
              {poster.eyebrow}
            </div>
            <div style={{ ...slot('headline'), fontSize: fH, fontWeight: 700, lineHeight: 1.1, color: headlineColor, letterSpacing: '-0.02em' }} onClick={click('headline')}>
              {poster.headline}
            </div>
            {poster.body && (
              <div style={{ ...slot('body'), fontSize: fBody, lineHeight: 1.45, color: bodyColor }} onClick={click('body')}>
                {poster.body}
              </div>
            )}
            {poster.cta && (
              <div style={{ marginTop: 8 * scale }} onClick={click('cta')}>
                <span style={{ ...slot('cta'), display: 'inline-flex', alignItems: 'center', background: ctaBg, color: ctaText, borderRadius: 999, padding: `${fCta * 0.42}px ${fCta * 0.95}px`, fontSize: fCta, fontWeight: 700 }}>
                  {poster.cta}
                </span>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{ position: 'absolute', bottom: 36 * scale, left: pad, right: pad, fontSize: fDisc, lineHeight: 1.4, color: discColor }}>
            This advertisement has not been reviewed by the Monetary Authority of Singapore. Protected up to specified limits by SDIC. Sample wording; replace with approved compliance text.
          </div>
        </>
      )}

      {/* ── BLEED layout ────────────────────────────────── */}
      {isBleed && (
        <>
          {/* Full-bleed image */}
          <img src={photoUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' }} onClick={click('heroImage')} />

          {/* Scrim */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(${isRed ? '180,0,50' : '20,14,30'},.88) ${sz.kind === 'wide' ? '100%' : '50%'}, transparent)` }} />
          {sz.kind === 'wide' && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,14,30,.85) 55%, transparent)' }} />
          )}

          {/* AIA logo */}
          <div style={{ position: 'absolute', top: 56 * scale, left: 64 * scale, color: '#FFFFFF', fontSize: fLogo, fontWeight: 800, letterSpacing: '0.04em', fontFamily: 'serif', zIndex: 2 }}>AIA</div>

          {/* Text */}
          <div style={{
            position: 'absolute',
            ...(sz.kind === 'wide'
              ? { left: 52 * scale, top: 96 * scale, width: W * 0.56, display: 'flex', flexDirection: 'column', gap: 14 * scale }
              : { bottom: 150 * scale, left: pad, right: pad, display: 'flex', flexDirection: 'column', gap: 14 * scale }),
          }}>
            <div style={{ fontSize: fEye, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }} onClick={click('eyebrow')}>{poster.eyebrow}</div>
            <div style={{ fontSize: fH, fontWeight: 700, lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em' }} onClick={click('headline')}>{poster.headline}</div>
            {poster.body && <div style={{ fontSize: fBody, lineHeight: 1.45, color: 'rgba(255,255,255,0.88)' }} onClick={click('body')}>{poster.body}</div>}
            {poster.cta && (
              <div style={{ marginTop: 8 * scale }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFFFF', color: '#D31145', borderRadius: 999, padding: `${fCta * 0.42}px ${fCta * 0.95}px`, fontSize: fCta, fontWeight: 700 }} onClick={click('cta')}>{poster.cta}</span>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{ position: 'absolute', bottom: 36 * scale, left: pad, right: pad, fontSize: fDisc, lineHeight: 1.4, color: 'rgba(255,255,255,0.55)' }}>
            This advertisement has not been reviewed by the Monetary Authority of Singapore. Protected up to specified limits by SDIC. Sample wording; replace with approved compliance text.
          </div>
        </>
      )}

      {/* ── SPLIT layout ────────────────────────────────── */}
      {isSplit && (
        <>
          {/* Coloured panel (left / top) */}
          {sz.kind === 'wide' || sz.kind === 'square'
            ? <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: sz.kind === 'square' ? '52%' : '50%', background: panelBg }} />
            : <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: H * 0.5, background: panelBg }} />
          }

          {/* Photo (right / bottom) */}
          {sz.kind === 'wide' || sz.kind === 'square'
            ? (
              <img src={photoUrl} alt="" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: sz.kind === 'square' ? '48%' : '50%', objectFit: 'cover', objectPosition: '50% 20%', height: '100%' }} onClick={click('heroImage')} />
            ) : (
              <img src={photoUrl} alt="" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: H * 0.5, width: '100%', objectFit: 'cover', objectPosition: '50% 20%' }} onClick={click('heroImage')} />
            )
          }

          {/* AIA logo */}
          <div style={{
            position: 'absolute',
            top: sz.kind === 'wide' ? 38 * scale : 56 * scale,
            left: sz.kind === 'wide' ? 48 * scale : 64 * scale,
            color: textOnDark ? '#fff' : '#D31145',
            fontSize: fLogo, fontWeight: 800, letterSpacing: '0.04em', fontFamily: 'serif', zIndex: 2,
          }}>AIA</div>

          {/* Text column */}
          <div style={{
            position: 'absolute',
            ...(sz.kind === 'wide'
              ? { left: 48 * scale, top: 114 * scale, width: W * 0.5 - 90 * scale }
              : sz.kind === 'square'
              ? { left: 60 * scale, top: 146 * scale, width: W * 0.52 - 110 * scale }
              : { left: 72 * scale, top: 164 * scale, width: W - 144 * scale, maxHeight: H * 0.5 - 196 * scale }),
            display: 'flex', flexDirection: 'column', gap: 14 * scale,
          }}>
            <div style={{ fontSize: fEye, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: textOnDark ? 'rgba(255,255,255,0.75)' : '#8A93A2' }} onClick={click('eyebrow')}>{poster.eyebrow}</div>
            <div style={{ fontSize: fH * (sz.kind === 'square' ? 0.84 : 1), fontWeight: 700, lineHeight: 1.1, color: textOnDark ? '#fff' : '#D31145', letterSpacing: '-0.02em' }} onClick={click('headline')}>{poster.headline}</div>
            {poster.body && <div style={{ fontSize: fBody, lineHeight: 1.45, color: textOnDark ? 'rgba(255,255,255,0.88)' : '#5B6472' }} onClick={click('body')}>{poster.body}</div>}
            {poster.cta && (
              <div style={{ marginTop: 8 * scale }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', background: ctaBg, color: ctaText, borderRadius: 999, padding: `${fCta * 0.42}px ${fCta * 0.95}px`, fontSize: fCta, fontWeight: 700 }} onClick={click('cta')}>{poster.cta}</span>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{
            position: 'absolute',
            bottom: 36 * scale,
            left: sz.kind === 'wide' ? 48 * scale : 72 * scale,
            right: sz.kind === 'wide' ? W * 0.5 + 10 * scale : sz.kind === 'square' ? W * 0.48 + 10 * scale : 72 * scale,
            fontSize: fDisc, lineHeight: 1.4, color: discColor,
          }}>
            This advertisement has not been reviewed by the Monetary Authority of Singapore. Protected up to specified limits by SDIC. Sample wording; replace with approved compliance text.
          </div>
        </>
      )}
    </div>
  );
}
