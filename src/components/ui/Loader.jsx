// ── Inline spinner ring ───────────────────────────────────
function Spinner({ size = 'md' }) {
  return <div className={`ldr-spinner ldr-spinner--${size}`} />;
}

// ── Pulsing dots (inline, compact) ───────────────────────
function Dots() {
  return (
    <div className="ldr-dots">
      <span /><span /><span />
    </div>
  );
}

/**
 * Loader
 *
 * Props:
 *   full  — boolean — covers the whole viewport (page-level)
 *   size  — 'sm' | 'md' | 'lg' — controls spinner size (non-full only)
 *   text  — string — loading message (full mode only)
 *   dots  — boolean — use pulsing dots instead of spinner (inline mode only)
 */
export default function Loader({
  full  = false,
  size  = 'md',
  text  = 'Loading…',
  dots  = false,
}) {
  // ── Full-page overlay ─────────────────────────────────
  if (full) {
    return (
      <div className="page-loader ldr-overlay">
        {/* Branded logo mark */}
        <div className="ldr-logo-wrap">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" className="ldr-logo-svg">
            <circle cx="26" cy="26" r="24" stroke="#1a7a3c" strokeWidth="1.5" fill="rgba(26,122,60,.06)"/>
            {/* Shield */}
            <path d="M26 12L14 17v8C14 32.6 19.3 38.2 26 40c6.7-1.8 12-7.4 12-15v-8L26 12z"
              stroke="#1a7a3c" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
            {/* Checkmark */}
            <path d="M20 26l4 4 8-8"
              stroke="#1a7a3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Spinning ring around logo */}
          <div className="ldr-logo-ring" />
        </div>

        <div className="ldr-full-text">
          <p className="ldr-full-label">{text}</p>
          <Dots />
        </div>

        <p className="ldr-full-brand">INEC Result Portal</p>
      </div>
    );
  }

  // ── Inline / section loader ───────────────────────────
  if (dots) {
    return (
      <div className="loader-wrapper ldr-wrapper">
        <Dots />
      </div>
    );
  }

  return (
    <div className="loader-wrapper ldr-wrapper">
      <Spinner size={size} />
    </div>
  );
}