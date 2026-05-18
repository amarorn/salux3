# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # tsc -b && vite build
npm run preview    # serve the production build locally
npm run typecheck  # tsc --noEmit
```

Node 18+. There is no test runner and no linter wired up — `typecheck` is the only static check.

## Big-picture architecture

This is an interactive pitch presentation for **Salux** (an agentic-AI health platform), designed primarily for a 1080×1920 vertical 65" totem (also works on desktop/mobile via auto-scaled stage). It is **not** a traditional slide deck — it's a Prezi-style spatial canvas with a cinematic camera traversing nodes laid out on an infinite 2D plane.

### Top-level flow

`main.tsx` → `App.tsx` → routing into:
1. **IntroScreen** (`components/IntroScreen.tsx`) — entry with animated Salux logo and cards for the 5 tracks.
2. **TransitionMorph** — morph effect between intro and presentation.
3. **PresentationCanvas** (`components/PresentationCanvas.tsx`) — the spatial canvas. Nodes are positioned in world coordinates; a `motion.div` "world" gets `transform: translate3d(x,y,0) scale(z)` driven by springs in `useCameraTransform`. Camera math lives in `lib/camera.ts` (`cameraForStep` = inverse-of-world transform).

A separate `landing/PremiumLanding` and `scenes/LusionExperience` exist as alternative entry experiences.

### Tracks model (important)

The app has **5 parallel presentations ("tracks")**, each with its own set of steps. `src/domain/tracks.ts` is the registry; track ids are:

- `era-agentica` → `presentation_receita.ts` (titled **Receita**)
- `operacoes` → `presentation_assistencial.ts` (titled **Assistencial**)
- `assistencial` → `presentation_operacao.ts` (titled **Operação**)
- `dados` → `presentation_gestao.ts` (titled **Gestão Pública**)
- `governanca` → `presentation_governanca.ts` (titled **IA Agêntica**)

Note the **track id does not match the human title** — id `assistencial` actually renders the "Operação" deck, etc. Always look up via `tracksById[trackId].meta.title`, never assume from the id.

`src/domain/presentation.ts` is legacy/shared and imported for side effects only.

### State (Zustand — `store/presentationStore.ts`)

Single store with selectors. Key fields:
- `currentTrackId`, `currentStepId`
- `transitionPhase`: `idle | morphing | done`
- `hasEntered`
- `isOverview` — show all nodes
- `governanceRevealExpanded` — progressive pillar reveal on the governance step

Use **fine-grained selectors** (`useStore(s => s.currentStepId)`) — the codebase relies on this to avoid mass re-renders.

### Step rendering

Each `PresentationStep` has a `kind` (`NodeKind`): `cover | narrative | architecture | journey | integration | governance | roadmap | closing` plus extras like `agentsFlow`, `capacities`, `pathways`, `highlight`, `results`. `components/PresentationNode.tsx` switch-dispatches to the matching `components/steps/*Step.tsx`.

To add a new step kind: create `components/steps/MyStep.tsx`, register it in `PresentationNode.tsx`'s switch, and add the step object to the relevant `presentation_*.ts` file. Position is in world px (cover at `(0,0)`, ~1500–2000 between clusters). `scale` is the camera zoom target (1.0 wide, 1.4 close-up).

### Stage / scaling

`components/Stage.tsx` + `hooks/useStageScale.ts` enforce the fixed 1080×1920 (9:16) palco via `transform: scale`. Designs should assume that canvas size; the runtime scales it to fit any viewport. `domain/stageAspect.ts` holds the constants.

### Why CSS transforms + Framer Motion (not React Flow or R3F)

DOM-based nodes preserve accessibility (`<button>` + `aria-label` + `aria-live`) and let GPU compositing carry 60fps. React Flow's diagram-DNA was wrong for the look, and R3F was overkill for what is really 2.5D parallax. The `domain/` ↔ visual split is deliberate so the renderer could be swapped later without rewriting data.

### Performance conventions

- `React.memo` is used on `PresentationNode`, `ConnectionLines`, overview map, and most step components — preserve this when editing.
- Connections render as **one** `<svg>` with memoized paths (`lib/geometry.ts` bezier helpers).
- Honor `prefers-reduced-motion` — `useCameraTransform` swaps spring for short tween in that case.

## Navigation (keyboard)

`→ / Space / PageDown` next · `← / PageUp` prev · `Home` cover · `End` closing · `O / Esc` overview · `1`–`9` direct jump. Click in overview focuses a node. Logic in `hooks/useKeyboardNavigation.ts` + `hooks/usePresentationNavigation.ts` + `usePresentationClickAdvance.ts` (with `data-no-click-advance` opt-out attribute on elements that shouldn't advance the deck on click — e.g. the permanent closing logo).

## Editing presentations

Single source of truth lives in `src/domain/presentation_*.ts`. When asked to change copy, slide content, ordering, or add a node, edit there — never hardcode strings in step components.
