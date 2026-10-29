import React, { Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../../css/tines.css";
import "./style.css";
import { palette, foundation, inks, inkColor, initialState } from "./data";
import { platforms } from "./platforms";
const Scene = lazy(() => import("./InkScene"));
const repo = "https://github.com/gongahkia/tines";
function Copy({
  value,
  label = "Copy value",
}: {
  value: string;
  label?: string;
}) {
  const [status, setStatus] = useState("");
  useEffect(() => setStatus(""), [value]);
  return (
    <span className="copy-wrap">
      <button
        className="copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setStatus("Copied");
          } catch {
            setStatus("Copy unavailable — select the text manually.");
          }
        }}
      >
        {label} <span aria-hidden="true">↗</span>
      </button>
      <span className="copy-status" role="status">
        {status}
      </span>
    </span>
  );
}
function Fallback() {
  return (
    <svg className="fallback" viewBox="0 0 600 450" role="img" aria-label="An ink droplet spreading into a bloom">
      <circle cx="300" cy="245" r="130" fill="currentColor" opacity=".12" />
      <path d="M181 269 C148 225 195 172 237 178 C270 121 338 146 357 174 C412 163 448 218 415 259 C434 314 365 341 324 320 C281 354 220 329 213 302 C195 300 187 287 181 269Z" fill="currentColor" opacity=".7" />
      <path d="M300 91 C284 119 266 138 266 158 A34 34 0 0 0 334 158 C334 138 316 119 300 91Z" fill="currentColor" />
    </svg>
  );
}
class SceneBoundary extends React.Component<
  { children: React.ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() { this.props.onFailure(); }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}
function App() {
  const [state, setState] = useState(initialState);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [platform, setPlatform] = useState(0);
  const { mode, ink, specimen } = state;
  const selected = inks.find((i) => i[0] === ink)!;
  const color = inkColor(mode, ink);
  const colors = palette.modes[mode];
  useEffect(() => {
    document.documentElement.dataset.tinesTheme = mode;
    document.documentElement.style.colorScheme = mode;
    try {
      localStorage.setItem("tines-preferences", JSON.stringify(state));
    } catch {}
  }, [state, mode]);
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(q.matches);
    q.addEventListener("change", change);
    return () => q.removeEventListener("change", change);
  }, []);
  const share = () => {
    const url = new URL(location.href);
    Object.entries(state).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.href;
  };
  return (
    <div style={{ "--ink": color } as React.CSSProperties}>
      <a className="skip" href="#collection">
        Skip to palette
      </a>
      <header>
        <a className="wordmark" href="#">
          tines<span className="nib-mark">◇</span>
        </a>
        <nav aria-label="Main">
          <a href="#collection">The inks</a>
          <a href="#specimens">In practice</a>
          <a href="#get">
            Get Tines <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <div className="mode" aria-label="Surface">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              aria-pressed={mode === m}
              onClick={() => setState({ ...state, mode: m })}
            >
              {m === "light" ? "Paper" : "Chalkboard"}
            </button>
          ))}
        </div>
      </header>
      <main>
        <div className="story"><section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">A color system with an analog soul</p>
            <h1>
              Ink,
              <br />
              <em>translated.</em>
            </h1>
            <p className="intro">
              The character of fountain-pen ink.
              <br />
              The clarity of a considered color system.
              <br />
              For code, prose, and the spaces between.
            </p>
            <div className="actions">
              <a className="primary" href="#get">
                Make it yours <span>↗</span>
              </a>
              <a className="text-link" href="#collection">
                Explore the inks <span>↓</span>
              </a>
            </div>
            {!reduced && <p className="scroll-cue">Scroll to watch the ink bloom <span aria-hidden="true">↓</span></p>}
          </div>

        </section>
        <section id="collection" className="collection">
          <div className="section-heading">
            <p className="eyebrow">01 / The ink collection</p>
            <h2>
              Nine inks.
              <br />
              <em>A common language.</em>
            </h2>
            <p>
              Blue-black gives the page its structure. A measured collection of
              companion inks brings meaning to every mark.
            </p>
          </div>
          <div className="ink-list" aria-label="Choose an ink">
            {inks.map(([id, name], i) => (
              <button
                key={id}
                aria-pressed={ink === id}
                onClick={() => setState({ ...state, ink: id })}
              >
                <span className="ink-number">0{i + 1}</span>
                <span
                  className="ink-daub"
                  style={{ background: inkColor(mode, id) }}
                />
                <span>{name}</span>
                <span className="chosen">{ink === id ? "✓" : "↗"}</span>
              </button>
            ))}
          </div>
          <div className="selected-line">
            <span>
              <strong>{selected[1]}</strong> /{" "}
              {mode === "light" ? "Paper" : "Chalkboard"}
            </span>
            <code>{color}</code>
            <Copy value={color} />
            <Copy value={share()} label="Copy this view" />
          </div>
          <details className="ramps">
            <summary>
              Inside the system <span>Foundation ramps & exact tokens +</span>
            </summary>
            <p>
              Approved foundation values. Click any shade to copy its exact hex.
              These ramps are shared by both modes; semantic roles choose their
              own anchors.
            </p>
            {Object.entries(foundation.ramps).map(([name, ramp]) => (
              <div className="ramp" key={name}>
                <h3>{name.replace("_", "-")}</h3>
                <div className="ramp-values">
                  {Object.entries(ramp).map(([step, hex]) => (
                    <div key={step}>
                      <span style={{ background: hex }} />
                      <small>{step}</small>
                      <code>{hex}</code>
                      <Copy value={hex} label={`Copy ${name} ${step}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="token-detail">
              <code>
                --tines-{selected[2].replaceAll(/[._]/g, "-")}: {color}
              </code>
              <Copy
                value={`var(--tines-${selected[2].replaceAll(/[._]/g, "-")})`}
                label="Copy CSS token"
              />
            </div>
          </details>
        </section>
        <section id="specimens" className="specimens">
          <div className="specimen-intro">
            <p className="eyebrow">02 / A living specimen</p>
            <h2>
              Made for
              <br />
              <em>your next line.</em>
            </h2>
            <p>Quiet surfaces. Legible hierarchy. Color with a job to do.</p>
            <p>
              Paper and Chalkboard are individually authored, so each feels at
              home in its own light.
            </p>
            <div className="specimen-buttons" aria-label="Specimen">
              {["code", "prose", "diff"].map((s) => (
                <button
                  key={s}
                  aria-pressed={specimen === s}
                  onClick={() => setState({ ...state, specimen: s })}
                >
                  {s === "diff" ? "Changes" : s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="specimen">
            <div className="specimen-bar">
              <span>
                {specimen === "code"
                  ? "a-small-observation.ts"
                  : specimen === "prose"
                    ? "Field notes / No. 01"
                    : "revision.diff"}
              </span>
              <span> {mode === "light" ? "Paper" : "Chalkboard"} edition</span>
            </div>
            {specimen === "code" ? (
              <pre>
                <code>
                  <span className="comment">
                    {"// A little room to think.\n"}
                  </span>
                  <span className="keyword">{"type "}</span>
                  {"Ink = {\n  name: "}
                  <span className="type">string</span>
                  {";\n  character: "}
                  <span className="type">string</span>
                  {";\n};\n\n"}
                  <span className="keyword">{"const "}</span>
                  {"collection: Ink[] = [\n  { name: "}
                  <span className="string">'Blue-black'</span>
                  {",\n    character: "}
                  <span className="string">'Quiet confidence'</span>
                  {" },\n];\n\n"}
                  <span className="comment">
                    {"// Good tools leave space for the work.\n"}
                  </span>
                  {"collection."}
                  <span className="function">map</span>
                  {"(ink => ink.name);"}
                </code>
              </pre>
            ) : specimen === "prose" ? (
              <article className="prose">
                <p className="eyebrow">An observation in {selected[1]}</p>
                <h3>
                  The pleasure of
                  <br />
                  <em>a deliberate mark.</em>
                </h3>
                <p>
                  A good ink does more than leave a trace. It gives a thought a
                  little weight, a line a little character, a blank page
                  somewhere to begin.
                </p>
                <p className="muted">
                  The same is true on a screen. A quiet background lets the
                  words come forward. A change of color tells you where to look.
                </p>
                <a href="#collection">Find your ink ↗</a>
              </article>
            ) : (
              <div className="diff">
                <p className="comment">A small revision, clearly marked.</p>
                <pre>
                  <code>
                    <span className="removed">− const surface = "noise";</span>
                    <span className="added">+ const surface = "quiet";</span>
                    <span className="changed">
                      ~ const intention = "make room";
                    </span>
                  </code>
                </pre>
                <p className="success">
                  ✓ Added, removed, and changed lines include signs as well as
                  color.
                </p>
              </div>
            )}
            <div className="specimen-foot">
              <span className="accent-dot" /> {selected[1]} accent{" "}
              <code>{color}</code>
            </div>
          </div>
        </section>
        <section id="get" className="get">
          <div className="section-heading">
            <p className="eyebrow">03 / Make it yours</p>
            <h2>
              A familiar ink.
              <br />
              <em>Wherever you work.</em>
            </h2>
            <p>
              From the editor to the terminal, bring the same considered palette
              to your everyday tools.
            </p>
          </div>
          <div className="install">
            <div className="platform-list" aria-label="Choose application">
              {platforms.map((p, i) => (
                <button
                  key={p.name}
                  aria-pressed={platform === i}
                  onClick={() => setPlatform(i)}
                >
                  {p.name}
                  <span>{platform === i ? "↗" : "→"}</span>
                </button>
              ))}
              <a href={`${repo}/blob/main/docs/PORTS.md`}>
                Explore all ports ↗
              </a>
            </div>
            <div className="install-detail">
              <p className="eyebrow">Tines for {platforms[platform].name}</p>
              <h3>{platforms[platform].description}</h3>
              <p>{platforms[platform].instructions}</p>
              <pre>
                <code>{platforms[platform].code}</code>
              </pre>
              <Copy
                value={platforms[platform].code}
                label="Copy installation snippet"
              />
              {platforms[platform].configuration && (
                <>
                  <pre>
                    <code>{platforms[platform].configuration}</code>
                  </pre>
                  <Copy
                    value={platforms[platform].configuration}
                    label="Copy configuration"
                  />
                </>
              )}
              <a className="text-link" href={platforms[platform].url}>
                Full installation instructions ↗
              </a>
            </div>
          </div>
          <div className="downloads">
            <div>
              <h3>Build with Tines.</h3>
              <p>The same source of truth, ready for your own interface.</p>
            </div>
            <a download href="/downloads/tines.css">
              Semantic CSS ↓
            </a>
            <a download href="/downloads/tines-palette.json">
              Palette JSON ↓
            </a>
            <a download href="/downloads/tines-foundation.json">
              Foundation JSON ↓
            </a>
          </div>
        </section>
        <section className="colophon">
          <span className="wordmark">tines◇</span>
          <p>
            Two tines. One line.
            <br />
            Inspired by the small details that make writing a pleasure: the edge
            of a nib, the depth of an ink, the quiet of a page.
          </p>
          <div>
            <a href={repo}>Find Tines on GitHub ↗</a>
            <p>
              A color system, not a font prescription.
              <br />
              Set it in whatever feels like you.
            </p>
          </div>
        </section>
        </div>
        <aside className="ink-rail" aria-label="Scroll-driven ink illustration">
          <figure className="hero-art">
            <div className="plate-label">
              <span>FIG. 01 / AN INK STUDY</span>
              <span>{mode === "light" ? "PAPER" : "CHALKBOARD"}</span>
            </div>
            <div className="scene">
              <SceneBoundary onFailure={() => setFailed(true)}>
                {failed ? (
                  <Fallback />
                ) : (
                  <Suspense fallback={<Fallback />}>
                    <Scene
                      color={color}
                      companions={[inkColor(mode, "teal"), inkColor(mode, "burgundy"), inkColor(mode, "moss")]}
                      background={colors.background}
                      dark={mode === "dark"}
                      reducedMotion={reduced}
                      onFailure={() => setFailed(true)}
                    />
                  </Suspense>
                )}
              </SceneBoundary>
            </div>
            <figcaption>
              <span>
                <i style={{ background: color }} />
                {selected[1]} ink
              </span>
              <span>
                {failed ? "Ink bloom · still illustration" : reduced ? "Ink bloom · still 3D study" : "Scroll to see the ink bloom · interactive 3D"}
              </span>
            </figcaption>
          </figure>
        </aside>
      </main>
      <footer>
        <span>Tines / An ink-inspired color system</span>
        <a href={`${repo}/blob/main/LICENSE`}>MIT licensed ↗</a>
        <a href="#">Back to the beginning ↑</a>
      </footer>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
