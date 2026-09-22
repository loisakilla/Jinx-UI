import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as JinxRuntime from '@jinx-ui/react/runtime';
import { JxButton, JxKbd } from '@jinx-ui/react/runtime';
import { Specimen } from './Specimen';

const COMPONENT_COUNT = Object.keys(JinxRuntime).filter((name) => name.startsWith('Jx')).length;

type Theme = 'dark' | 'light';
type StyleMode = 'brutal' | 'glass' | 'minimal';

const STYLE_MODES: Array<{ value: StyleMode; label: string; radius: number }> = [
  { value: 'brutal', label: 'Brutal', radius: 4 },
  { value: 'glass', label: 'Glass', radius: 14 },
  { value: 'minimal', label: 'Minimal', radius: 14 }
];

const ACCENT_PRESETS: Array<{ color: string; label: string }> = [
  { color: '#c9a3ff', label: 'lavender' },
  { color: '#d4ff3d', label: 'lime' },
  { color: '#79c8ff', label: 'sky' },
  { color: '#ff5470', label: 'coral' },
  { color: '#6bd97a', label: 'mint' }
];

function applyAccent(color: string) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const root = document.documentElement;
  root.style.setProperty('--jx-accent', color);
  root.style.setProperty('--jx-accent-soft', `rgba(${r}, ${g}, ${b}, 0.14)`);
  root.style.setProperty('--jx-accent-ink', lum > 0.6 ? '#0c0a14' : '#ffffff');
}

function clearAccent() {
  const root = document.documentElement;
  for (const token of ['--jx-accent', '--jx-accent-soft', '--jx-accent-ink']) root.style.removeProperty(token);
}

const radiusTokens = ['--jx-r-xs', '--jx-r-sm', '--jx-r', '--jx-r-lg', '--jx-r-xl', '--jx-r-pill'];

function applyRadius(value: number) {
  const root = document.documentElement;
  radiusTokens.forEach((token) => root.style.setProperty(token, `${value}px`));
}

function Tweaks({
  theme,
  styleMode,
  accent,
  radius,
  onTheme,
  onStyle,
  onAccent,
  onRadius,
  open,
  onOpenChange,
  openerRef
}: {
  theme: Theme;
  styleMode: StyleMode;
  accent: string | null;
  radius: number;
  onTheme: (next: Theme) => void;
  onStyle: (next: StyleMode) => void;
  onAccent: (next: string | null) => void;
  onRadius: (next: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      openerRef.current?.focus();
      return undefined;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange, openerRef]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="jx-tweaks"
          className="is-open"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="jx-tw-head">
            <h3 id={titleId}>Tweaks</h3>
            <button type="button" className="jx-tw-close" aria-label="Close tweaks" onClick={() => onOpenChange(false)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="jx-tw-row">
            <label>
              Theme
              <span>{theme}</span>
            </label>
            <div className="jx-tabs jx-tw-skip" role="tablist">
              {(['dark', 'light'] as Theme[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  className="jx-tab"
                  aria-selected={theme === value ? 'true' : 'false'}
                  onClick={() => onTheme(value)}
                >
                  {value === 'dark' ? 'Dark' : 'Light'}
                </button>
              ))}
            </div>
          </div>
          <div className="jx-tw-row">
            <label>
              Style
              <span>{styleMode}</span>
            </label>
            <div className="jx-tabs jx-tw-skip" role="tablist">
              {STYLE_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  role="tab"
                  className="jx-tab"
                  aria-selected={styleMode === mode.value ? 'true' : 'false'}
                  onClick={() => onStyle(mode.value)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="jx-tw-row">
            <label>
              Accent
              <span>{accent ?? 'theme'}</span>
            </label>
            <div className="jx-tw-colors">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  className={`jx-tw-color${preset.color === accent ? ' is-active' : ''}`}
                  style={{ background: preset.color }}
                  aria-label={preset.label}
                  onClick={() => onAccent(preset.color)}
                />
              ))}
            </div>
          </div>
          <div className="jx-tw-row">
            <label>
              Radius
              <span>{radius}px</span>
            </label>
            <input
              type="range"
              className="jx-slider"
              min={0}
              max={28}
              step={1}
              value={radius}
              onChange={(event) => onRadius(Number(event.target.value))}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Nav({ onOpenTweaks, openerRef }: { onOpenTweaks: () => void; openerRef: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <header className="jx-nav">
      <div className="jx-container jx-nav-inner">
        <a href="#" className="jx-logo">
          <span className="jx-logo-name">
            J<em>inx</em>
          </span>
          <span className="jx-logo-stamp">UI</span>
        </a>
        <nav className="jx-nav-links">
          <a href="#specimen">Specimen</a>
          <a href="#doctrine">Doctrine</a>
          <a href="#install">Install</a>
        </nav>
        <div className="jx-nav-right">
          <button
            ref={openerRef}
            id="jx-tw-open"
            type="button"
            className="jx-btn jx-btn--secondary jx-btn--sm"
            aria-expanded="false"
            onClick={onOpenTweaks}
          >
            Tweaks
            <JxKbd>T</JxKbd>
          </button>
        </div>
      </div>
    </header>
  );
}

function Ticker() {
  const items = ['CSS-first', 'TSX runtime', 'framer-motion', 'a11y default', 'no inline HTML', 'mode-switch'];
  return (
    <div className="jx-ticker">
      <div className="jx-ticker-track">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="jx-ticker-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero({ onOpenTweaks }: { onOpenTweaks: () => void }) {
  return (
    <section className="jx-hero" data-screen-label="Hero">
      <div className="jx-container">
        <div className="jx-hero-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 56, alignItems: 'end', paddingBottom: 80 }}>
          <h1>
            A small library <br /> for <em>loud</em> interfaces.
          </h1>
          <div className="jx-hero-aside">
            <p>{COMPONENT_COUNT} React components, three style modes, one CSS namespace. Built TSX-first, animated with framer-motion.</p>
            <div className="jx-hero-aside-actions">
              <JxButton variant="primary" onClick={onOpenTweaks}>Open Tweaks</JxButton>
              <a href="#specimen">
                <JxButton variant="outline">Browse specimen</JxButton>
              </a>
            </div>
          </div>
        </div>
        <div className="jx-hero-meta">
          <div>
            <div className="jx-hero-meta-num">
              {COMPONENT_COUNT}<small>components</small>
            </div>
            <div className="jx-hero-meta-label">Runtime</div>
            <div className="jx-hero-meta-sub">All shipped as TSX.</div>
          </div>
          <div>
            <div className="jx-hero-meta-num">
              3<small>modes</small>
            </div>
            <div className="jx-hero-meta-label">Brutal · Glass · Minimal</div>
            <div className="jx-hero-meta-sub">Switch live via Tweaks.</div>
          </div>
          <div>
            <div className="jx-hero-meta-num">
              3<small>packages</small>
            </div>
            <div className="jx-hero-meta-label">Tokens · Core · React</div>
            <div className="jx-hero-meta-sub">Take the CSS, the runtime, or both.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Doctrine() {
  return (
    <section className="jx-section" id="doctrine" data-screen-label="Doctrine">
      <div className="jx-container">
        <div className="jx-section-head">
          <div className="jx-section-label" data-num="B.">Doctrine</div>
          <h2>
            Three rules. <em>No exceptions.</em>
          </h2>
        </div>
        <div className="jx-doctrine">
          <div className="jx-doctrine-item">
            <div className="jx-doctrine-num">01</div>
            <h3>
              CSS is <em>load-bearing.</em>
            </h3>
            <p>The visual contract lives in `@jinx-ui/core`. Components render the same `jx-*` markup whether you use TSX or hand-written HTML.</p>
          </div>
          <div className="jx-doctrine-item">
            <div className="jx-doctrine-num">02</div>
            <h3>
              Motion has <em>intent.</em>
            </h3>
            <p>Tabs and toggles use shared-layout transitions. Modals fade and scale. Toasts slide. Accordion content morphs. No spinning crystals.</p>
          </div>
          <div className="jx-doctrine-item">
            <div className="jx-doctrine-num">03</div>
            <h3>
              Controlled, <em>uncontrolled,</em> never magical.
            </h3>
            <p>Every stateful primitive exposes `value`/`defaultValue`/`onValueChange`. No global stores. No surprise re-renders. No "magic" props.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Install() {
  return (
    <section className="jx-section" id="install" data-screen-label="Install">
      <div className="jx-container">
        <div className="jx-section-head">
          <div className="jx-section-label" data-num="C.">Install</div>
          <h2>
            Not on npm. <em>Clone</em> it, or take the CSS.
          </h2>
          <p>
            The three packages are built and ready to publish, but they are not on npm yet. Consume them from this repository as a clone or a git submodule; the CSS layer works on its own, without the React runtime.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
          <pre className="jx-snippet jx-snippet--block" style={{ margin: 0 }}>
            <span className="jx-snippet-code">{`git clone https://github.com/loisakilla/Jinx-UI.git
cd Jinx-UI && npm install && npm run dev`}</span>
          </pre>
          <pre className="jx-snippet jx-snippet--block" style={{ margin: 0 }}>
            <span className="jx-snippet-code">{`import '@jinx-ui/core';
import { JxButton, JxModal } from '@jinx-ui/react';

<JxButton variant="primary">Ship it</JxButton>`}</span>
          </pre>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="jx-footer">
      <div className="jx-container">
        <div className="jx-footer-bottom">
          <div>© {new Date().getFullYear()} Jinx UI · loud interfaces only</div>
          <div>
            <a href="#specimen">specimen</a> · <a href="#doctrine">doctrine</a> · <a href="#install">install</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [styleMode, setStyleMode] = useState<StyleMode>('brutal');
  const [accent, setAccent] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(4);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-style', styleMode);
    const initial = STYLE_MODES.find((mode) => mode.value === styleMode)?.radius ?? 4;
    setRadius(initial);
  }, [styleMode]);

  useEffect(() => {
    if (accent) applyAccent(accent);
    else clearAccent();
  }, [accent]);

  useEffect(() => {
    applyRadius(radius);
  }, [radius]);

  const onOpenTweaks = useCallback(() => setTweaksOpen(true), []);

  return (
    <>
      <Nav onOpenTweaks={onOpenTweaks} openerRef={openerRef} />
      <Hero onOpenTweaks={onOpenTweaks} />
      <Ticker />
      <Doctrine />
      <Specimen />
      <Install />
      <Footer />
      <Tweaks
        theme={theme}
        styleMode={styleMode}
        accent={accent}
        radius={radius}
        onTheme={setTheme}
        onStyle={setStyleMode}
        onAccent={setAccent}
        onRadius={setRadius}
        open={tweaksOpen}
        onOpenChange={setTweaksOpen}
        openerRef={openerRef}
      />
    </>
  );
}
