# Trilha Era Agêntica

Apresentação espacial não-linear, no espírito do Prezi, sobre **a era agêntica como resposta ao limite da digitalização em saúde**. A câmera viaja de forma cinematográfica entre 9 etapas dispostas em um grande canvas, com conexões visuais, mini-mapa, modo overview e navegação por teclado.

> Stack: **React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zustand · Lucide React**.

---

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
```

Outros scripts:

```bash
npm run build    # build de produção (tsc + vite build)
npm run preview  # serve o build local
npm run typecheck
```

Requisitos: Node 18+.

---

## Navegação

| Ação | Atalho |
|------|--------|
| Próxima etapa | `→` · `Espaço` · `PageDown` |
| Etapa anterior | `←` · `PageUp` |
| Capa | `Home` |
| Encerramento | `End` |
| Modo overview | `O` · `Esc` |
| Salto direto | `1`–`9` |
| Clique em nó | foca o nó (sai do overview) |
| Mini-mapa | clique nos pontos |

---

## Decisões técnicas

### Por que **CSS transforms + Framer Motion** em vez de React Flow ou R3F

| Caminho | Por que descartado |
|---|---|
| **React Flow** | Excelente para whiteboards e diagramas editáveis, mas o "DNA" visual é de fluxograma. Customizar para look premium é luta constante; controle de easing da câmera é menos expressivo que animar `MotionValue` direto. |
| **Three.js / R3F** | Overkill — a referência é 2.5D (zoom + parallax), não 3D real. Tipografia e acessibilidade no canvas WebGL custam caro; sem DOM, perdem-se foco, ARIA e screen readers. |
| **CSS transforms + FM** ✅ | Câmera = inverso do mundo: `translate(vw/2 − px·z, vh/2 − py·z) scale(z)`. Animado via spring do Framer Motion → travelling cinematográfico real. Os nós continuam sendo DOM (`<button>`), então acessibilidade, foco, hover e SEO funcionam de graça. GPU compositing entrega 60fps com folga. |

### Camadas

```
domain/        ← dados e tipos da apresentação (single source of truth)
store/         ← Zustand: passo atual, overview
hooks/         ← navegação, teclado, câmera, viewport
lib/           ← matemática pura (camera, geometry, keyboard)
components/    ← camada visual: canvas, câmera, nós, controles
components/steps/  ← variações visuais por kind do nó
```

A separação `domain` ↔ visual permite trocar o renderer (ex.: para R3F no futuro) sem reescrever os dados.

### Câmera

```ts
// lib/camera.ts
cameraForStep(step, viewport) = {
  scale: step.scale,
  x: viewport.width  / 2 - step.position.x * step.scale,
  y: viewport.height / 2 - step.position.y * step.scale,
}
```

Aplicado a um `<motion.div>` "world" via `transform: translate3d(x,y,0) scale(z)`. Em `useCameraTransform`, valores são interpolados por `animate(motionValue, target, { type: 'spring', stiffness: 70, damping: 22 })`. Em `prefers-reduced-motion`, troca para `tween` curto.

### Performance

- `React.memo` em `PresentationNode`, `ConnectionLines`, `OverviewMap` e steps especializados.
- Selectors finos no Zustand (`useStore(s => s.currentStepId)`) — evita re-render em massa.
- Conexões em **um único** `<svg>` com paths memoizados.
- Apenas elementos animados são `motion`; estáticos seguem sendo `<div>`.
- `will-change: transform` no world (via `will-change-transform`) só durante animação.

### Acessibilidade

- Cada nó é `<button>` com `aria-label` descritivo e `aria-current="true"` no ativo.
- `aria-live="polite"` anuncia a etapa atual a screen readers.
- Focus visible em todos os controles (`focus-visible:ring-*`).
- Contraste AA (texto slate-900 em superfícies brancas).
- Honra `prefers-reduced-motion`.

---

## Como adicionar uma nova etapa

1. Edite `src/domain/presentation.ts` e adicione um objeto na lista `steps`:

```ts
{
  id: 'minha-etapa',
  index: 9,
  title: 'Título',
  subtitle: 'Subtítulo',
  position: { x: 1200, y: -1200 },  // coords no "world" (px lógicos)
  scale: 1.3,                        // zoom-alvo da câmera
  kind: 'narrative',                 // ou outro NodeKind
  accent: 'cyan',
  content: { headline: '...', body: '...', bullets: ['...'] },
}
```

2. (Opcional) Conecte com outras etapas em `src/domain/connections.ts`:

```ts
{ from: 'cover', to: 'minha-etapa', curvature: 0.2 },
```

3. Se for um `kind` novo, crie `src/components/steps/MeuStep.tsx` e registre em `src/components/PresentationNode.tsx` (`switch (step.kind)`).

Pronto. Store, navegação, mini-mapa e teclado lidam automaticamente.

### Posicionamento dica

O canvas é "infinito" (em px lógicos). O nó da capa fica em `(0,0)`. Distâncias de `~1500–2000` entre clusters dão sensação de "salto" entre regiões. `scale` controla quanto a câmera se aproxima — `1.0` é a vista ampla; `1.4` é um close-up enfático.

---

## Estrutura

```
salux3/
├─ index.html
├─ package.json
├─ tailwind.config.ts · postcss.config.js
├─ tsconfig.json · tsconfig.app.json · tsconfig.node.json
├─ vite.config.ts
├─ public/favicon.svg
└─ src/
   ├─ main.tsx · App.tsx · index.css
   ├─ domain/
   │  ├─ types.ts                 — PresentationStep, CameraState, Connection, Theme
   │  ├─ presentation.ts          — 9 etapas + meta
   │  ├─ connections.ts           — arestas entre nós
   │  └─ theme.ts                 — tokens de acento
   ├─ store/presentationStore.ts  — Zustand
   ├─ hooks/
   │  ├─ usePresentationNavigation.ts
   │  ├─ useKeyboardNavigation.ts
   │  ├─ useCameraTransform.ts
   │  └─ useViewportSize.ts
   ├─ lib/
   │  ├─ camera.ts                — cameraForStep / cameraForOverview
   │  ├─ geometry.ts              — bezier entre dois pontos
   │  └─ keyboard.ts              — mapeamento de teclas
   └─ components/
      ├─ PresentationCanvas.tsx
      ├─ CameraController.tsx
      ├─ ConnectionLines.tsx
      ├─ HeroCluster.tsx
      ├─ PresentationNode.tsx
      ├─ FloatingCard.tsx
      ├─ NavigationControls.tsx
      ├─ OverviewMap.tsx
      └─ steps/
         ├─ CoverStep.tsx
         ├─ NarrativeStep.tsx
         ├─ ArchitectureStep.tsx
         ├─ JourneyStep.tsx
         ├─ IntegrationStep.tsx
         ├─ GovernanceStep.tsx
         ├─ RoadmapStep.tsx
         └─ ClosingStep.tsx
```

---

## Roadmap futuro (fora do escopo desta entrega)

- Drag-pan livre opcional (a navegação atual é guiada — drag confunde a leitura narrativa).
- Editor visual: arrastar nós no canvas, persistir `position/scale` em `presentation.ts`.
- Exportação para PDF / vídeo MP4 (sequência de transições).
- Múltiplos decks em rotas separadas (`react-router-dom`).
- Tema escuro.

---

## Créditos

Conteúdo curado para Cactus · Salux. Tipografia Inter / Inter Tight via Google Fonts. Ícones [Lucide](https://lucide.dev). Animações com [Framer Motion](https://www.framer.com/motion/).
