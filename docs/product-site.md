# Tines standalone product site

## Scope and design

The new React/TypeScript application lives in `site/`. It is independent of the
existing personal-website project page and of `showcase/`, which remains the
canonical palette-review tool. The product direction is an ink specimen book:
cool-neutral Paper, independently authored charcoal Chalkboard, editorial serif
headlines, clear utility text, and selectable code. Fonts belong to the website;
the Tines theme itself remains font-neutral.

A procedural Three.js droplet and ink bloom illustrate the selected ink. Lighting is an artistic interpretation; HTML swatches and copied values
use the actual opaque canonical colors. No external model license is required.

## Palette architecture

`palette/foundation.json` supplies 13-step ramps for neutral, blue-black, moss,
teal, burgundy, rust, violet, amber, sepia, and graphite. `palette/aliases.json`
resolves light and dark roles to ramps/approved anchors. `palette/palette.json`
is the locked semantic source, pinned by `palette/lock.json`. Generated
`css/tines.css` and `dist/tines-palette.json` expose the existing semantics;
`css/tines-foundation.css` and `dist/tines-foundation.json` expose ramps.
The website must consume these sources directly or copy generated downloads
deterministically, never maintain another hand-authored palette.

Build output is `site/dist`, never the repository's `dist/` export directory.
No palette, generator, alias, lockfile, port, README, or showcase change is needed.

## Verified adoption content

The origin is `https://github.com/gongahkia/tines`. Installation data in
`site/src/platforms.ts` was derived from `docs/GHOSTTY.md`, `docs/NEOVIM.md`,
`docs/VSCODE.md`, `docs/ZED.md`, and `docs/PORTS.md`.

- Ghostty requires 1.3.0+; the helper is dry-run without `--apply` and installs
  both variants. Paired theme syntax is `light:tines-light,dark:tines-dark`.
- Neovim requires 0.10+ and an installed checkout/plugin before selection.
- VS Code targets ^1.85.0. The repository supplies a local VSIX packaging path,
  shared by Cursor; no marketplace availability is claimed.
- Zed uses Install Dev Extension on `zed/`, not `zed/themes/`, with schema v0.2.0.
- CSS supplies semantic variables with explicit theme overrides and system
  preference support. The port guide also documents Tailwind v4 and terminal,
  shell, editor, and messaging ports with their respective limitations.

`asset/reference/ghostty-1.png` was visually inspected: it retains the historical
“Nib” name and is not fresh Tines runtime evidence. Avoid presenting it as a new
capture. The product page uses HTML specimens and accurate install paths.

## Contrast and accessibility boundaries

The repository targets 7:1 principal text, 4.5:1 ordinary meaningful text, and
3:1 UI boundaries/focus on intended opaque surfaces. Its generated report is
not certification of the website. Syntax roles retain their meaning when the
selected ink changes. States need text/signs in addition to color. Exact
foundation ramp values are inspection samples, not automatically text colors.

## Deployment setup

Use a separate Vercel project, leaving the personal website untouched. Import
this repository with repository root as Project Root so canonical sources
outside `site/` remain available. Set Framework Preset to Other, Install Command
to `npm ci --prefix site`, Build Command to `npm run build --prefix site`, and
Output Directory to `site/dist`. Use Node 22 or a newer compatible supported
Node version. No environment variables or backend are needed.

For local work: `npm ci --prefix site`, then `npm run dev --prefix site`.
For a production bundle: `npm run build --prefix site`.
A deployment must be reported only after the hosting command returns a URL;
add a canonical URL only when that real URL is known. GitHub description and
homepage metadata remain for the owner to update.

## Existing repository verification

Executed on 2026-10-29 before site integration:

- `make check-generated`: passed; checked-in exports match the generator.
- `make verify`: all 21 checks passed, covering palette schema, aliases and lock,
  deterministic generation, contrast, color-vision redundancy, ANSI, ports,
  installers and conflict handling, fixtures, documentation, and showcase.
- Runtime checks passed for Vim 9.1, fzf 0.74.3, Ghostty 1.3.1, and Neovim 0.12.4.
- Emacs and Zed runtimes were skipped because unavailable; static validation
  passed. Shader compilation was skipped because glslc is unavailable. Ruff
  was unavailable; Python byte compilation passed.

Site-specific build, browser, screenshot, performance and deployment outcomes
will be appended after implementation; none are claimed by the checks above.

External-link check: the repository landing page and all five linked installation
pages (Ghostty, Neovim, VS Code, Zed, Ports) returned HTTP 200 on 2026-10-29.

## Site implementation and state

React 19 and React Three Fiber 9 follow the official compatibility pairing
(https://r3f.docs.pmnd.rs/getting-started/installation). Vite 7 runs on the
available Node 24; Vite requires Node 20.19+ or 22.12+
(https://vite.dev/guide/). Dependencies are pinned by `site/package-lock.json`.
No external fonts, models, textures, trackers, or application services are used.

`src/data.ts` imports canonical JSON. `src/main.tsx` owns small local state,
semantic specimens and adoption controls; `src/InkScene.tsx` is dynamically
imported and isolated behind a loading illustration and error boundary.
`src/platforms.ts` contains verified instructions. `src/style.css` consumes the
existing generated semantic CSS. The Vite plugin serves downloads locally and
emits byte-identical existing exports in production.

Preference precedence is valid URL parameter → valid saved preference → system
appearance/default blue-black/code. Unknown parameter values are ignored;
malformed or unavailable storage cannot block rendering. Copy this view creates
a URL containing all three presentation choices without modifying browser
history. Theme selection is explicit after initial load. Reduced-motion changes
are observed live. Copy errors provide selectable original text and feedback.

The scene renders on demand, caps DPR at 1.5, and uses no recurring animation
loop. Scroll position drives the scene on demand; it does not capture scrolling. Offscreen scenes have no autonomous work. GPU geometry and event handlers are disposed. Context loss switches to
a composed SVG illustration; the palette and adoption content remain HTML.

## Build and performance evidence

`npm ci --prefix site` passed; npm audit reported zero vulnerabilities.
`npm run build --prefix site` passed TypeScript and Vite production build.
Production bundle sizes: core JavaScript ~77.5 KB gzip, CSS ~4.2 KB gzip,
lazy Three.js/R3F scene ~242 KB gzip. Vite emits a large-chunk advisory for the
~893 KB uncompressed scene. It is kept separate from the core UI; no scene is
disabled to improve measurements.

A local Chrome desktop production navigation measured LCP 824 ms and CLS
0.0192 using PerformanceObserver. This is a single local, unthrottled sample,
not a field performance claim or mobile benchmark. The canvas rendered.

## Deployment handoff

`npm exec --yes --package=vercel -- vercel whoami` returned “Logged out.”
No deployment was created. The exact missing requirement is authentication to
a Vercel account/team permitted to create a new standalone project.

From the repository root after authentication:

```sh
npx vercel login
npx vercel link
npx vercel deploy --prod
```

During link, create a **new** project (for example `tines-product`), use this
repository root, and do not select the personal website project. `vercel.json`
already supplies install/build/output commands. Alternatively import the GitHub
repository as a new Vercel project using the settings above after this branch is
pushed. Leave GitHub homepage/description unchanged. Verify the returned URL,
refresh, both themes, canvas/fallback, narrow layout, and `/downloads/tines.css`
contents. Then add an absolute canonical URL and absolute `og:image` URL using
the actual domain. The current preview image is a locally generated 1200×630
PNG (`site/scripts/brand-assets.mjs`); the favicon is generated from the same
canonical colors. Hashed assets cache immutably; downloads revalidate.

## Independent review refinements

The independent reviewer inspected the rendered desktop Paper/Chalkboard and
mobile Paper captures, then tested interactions against the production preview
rather than Vite HMR. Concrete findings fixed during review:

- Syntax specimens initially assigned strings to moss and types to amber;
  corrected to the documented teal strings / moss types / burgundy keywords.
- Development download requests initially returned the HTML shell; corrected
  middleware path matching. Production downloads were already generated correctly.
- The mobile hero's intrinsic headline width expanded its grid beyond the
  viewport; corrected responsive headline sizing and zero-minimum grid tracks.
- Lit ink appeared too pale; changed ink to an unlit palette-colored material
  while retaining metallic lighting on the nib.
- Renderer-error fallback captions now describe the still illustration.

Text contrast was also calculated for the site's elevated panels using the
repository's contrast function: principal/secondary/muted are respectively
11.95/7.37/4.88 in Paper and 11.53/8.28/5.67 in Chalkboard. These checks cover
those opaque pairs, not a blanket certification.

Rejected alternatives: additional surface shadows would distract from the fine
rules and paper structure; larger/saturated accent panels would weaken the
restrained ink hierarchy. No continuous animation was introduced.

## Final browser verification

`npm test --prefix site` passed all 10 Playwright tests against the production
preview at `http://127.0.0.1:4173` (1.3 minutes). Configuration starts the preview
if needed; build first. `BASE_URL` can override the tested origin. Tests use
installed Google Chrome with software WebGL for deterministic headless rendering.

Verified: all 18 current-mode ink values and all 130 foundation values match the
canonical JSON; URL/saved/system precedence, invalid values, malformed JSON,
storage denial, persistence, copy success and rejection, shared URL contents,
keyboard ink selection/skip link, specimen switching, expanded ramps, application
instructions, and byte-for-byte equality of all four downloadable exports.
Normal rendering produced no page errors or console errors at 1440, 900, and
390 pixels in both themes. All those layouts and the expanded 320-pixel ramp
layout had no document horizontal overflow. Forced WebGL unavailability preserved
the still illustration and working controls under reduced motion.

Final screenshots are in `output/product-site/`: `desktop-light.png`,
`desktop-dark.png`, `tablet-light.png`, `tablet-dark.png`, `mobile-light.png`,
`mobile-dark.png`, `fallback-reduced-motion.png`, and `narrow-ramps.png`.
The independent reviewer opened the desktop and mobile images and fallback
capture: recognizable nib, stronger ink after refinement, coherent type/rules,
readable hierarchy, and corrected mobile edges. Intermediate captures were removed; use the final light/dark pairs for handoff.

The primary agent additionally executed `site/scripts/contrast.mjs`, measuring
actual computed opaque text/background pairs for intro, syntax roles, install
panel text, eyebrow, copy controls, specimen foot and hero accent in both modes.
Those measured pairs passed with a minimum 5.31:1. The final tracked-originals
diff audit reported no changes to README files, personal website, showcase,
canonical sources, existing generated exports, or ports.

No actionable visual defects remained in the inspected states. Browser scope is
Chrome desktop engine with responsive viewports, not physical mobile hardware
or Safari/Firefox validation. The intentional WebGL failure test emits expected
renderer diagnostics; the ordinary-rendering test separately asserts no errors.

A separate actual `WEBGL_lose_context.loseContext()` browser check passed: the
canvas switched to the SVG and the caption became “still illustration.”

## Scroll-driven ink study revision

The illustration accompanies the full story in a sticky right-hand rail. The
3D droplet forms, falls and spreads into a procedural feathered bloom as page
scroll advances; the chosen semantic ink and companion teal, burgundy and moss
colors come from the current canonical mode. The shader is an artistic blend,
not a source of copyable colors. On phones the illustration becomes a compact
sticky panel above the text. Reduced motion shows a still bloom, and WebGL
failure retains the SVG fallback. The controls and page remain ordinary HTML.
The earlier screenshots and review notes above describe the previous nib design.
