import { Poster, TPL_MAP, SIZES, CAT_PALETTE } from '@/lib/mockData';

const PHOTO_URLS: Record<string, string> = {
  couple:  'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=600&q=80',
  toast:   'https://images.unsplash.com/photo-1555685812-4b8f286d4b6c?w=600&q=80',
  dinner:  'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80',
  headshot:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
};

interface Props {
  poster: Poster;
  width?: number;
  height?: number;
  className?: string;
}

export default function PosterThumb({ poster, width = 200, height = 250, className }: Props) {
  const tpl = TPL_MAP[poster.templateId];
  const sz = SIZES[poster.size];
  const pal = CAT_PALETTE[poster.cat];

  const aspect = sz.w / sz.h;
  const displayW = width;
  const displayH = Math.round(width / aspect);
  const maxH = height;
  const finalH = Math.min(displayH, maxH);
  const finalW = Math.round(finalH * aspect);

  const photoKey = tpl?.heroImage || 'couple';
  const photoUrl = PHOTO_URLS[photoKey] || PHOTO_URLS.couple;
  const isBleed = tpl?.layout === 'bleed';
  const isSplit = tpl?.layout === 'split';
  const isRedPanel = tpl?.bg === '#D31145' || tpl?.bg === '#9A0828';

  const bgColor = isBleed ? '#1a1a2e' : (isRedPanel ? tpl.bg : (tpl?.bg || '#fff'));
  const textColor = isRedPanel || isBleed ? '#fff' : (tpl?.accentColor || '#D31145');

  return (
    <div
      className={className}
      style={{
        width: finalW,
        height: finalH,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        background: bgColor,
        flexShrink: 0,
      }}
    >
      {/* Hero image */}
      <img
        src={photoUrl}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 20%',
          opacity: isBleed ? 0.7 : (isSplit ? 1 : 0.55),
          ...(isSplit && !isRedPanel ? {
            left: '50%',
            width: '50%',
          } : {}),
        }}
      />

      {/* Gradient overlay */}
      {isBleed && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, rgba(${tpl?.bg === '#D31145' ? '211,17,69' : '31,42,55'},.85) 45%, transparent)`,
        }} />
      )}
      {!isBleed && !isSplit && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(255,255,255,.95) 35%, rgba(255,255,255,.4) 70%)',
        }} />
      )}
      {isRedPanel && (
        <div style={{
          position: 'absolute', inset: 0, right: '50%',
          background: tpl.bg,
        }} />
      )}

      {/* Text overlay */}
      <div style={{
        position: 'absolute',
        ...(isBleed ? { bottom: 8, left: 8, right: 8 } : (isSplit ? { left: 8, top: '40%', transform: 'translateY(-50%)', right: '52%' } : { bottom: 8, left: 8, right: 8 })),
        color: textColor,
      }}>
        <div style={{ fontSize: Math.round(finalW * 0.055), fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 2 }}>
          {poster.eyebrow}
        </div>
        <div style={{ fontSize: Math.round(finalW * 0.09), fontWeight: 700, lineHeight: 1.15 }}>
          {poster.headline}
        </div>
      </div>

      {/* AIA logo mark */}
      <div style={{
        position: 'absolute', top: 6, left: 8,
        fontSize: Math.round(finalW * 0.06), fontWeight: 800, letterSpacing: '0.04em',
        color: isBleed || isRedPanel ? '#fff' : '#D31145',
        fontFamily: 'serif',
      }}>
        AIA
      </div>
    </div>
  );
}
