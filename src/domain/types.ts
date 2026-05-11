export type NodeKind =
  | 'cover'
  | 'narrative'
  | 'architecture'
  | 'journey'
  | 'integration'
  | 'governance'
  | 'roadmap'
  | 'highlight'
  | 'closing';

export type Accent = 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate';

export interface NodePosition {
  x: number;
  y: number;
}

export interface NarrativeMetric {
  value: number;
  decimals?: number;
  suffix: string;
}

export type RoadmapSegment =
  | { type: 'text'; text: string }
  | { type: 'product'; name: string };

export interface RoadmapAgentCard {
  title: string;
  segments: RoadmapSegment[];
}

export interface StepContent {
  headline?: string;
  body?: string;
  bullets?: string[];
  /** Pilares revelados após o primeiro clique (Governança). */
  revealPillars?: string[];
  roadmapAgents?: RoadmapAgentCard[];
  metrics?: NarrativeMetric[];
  meta?: Record<string, string>;
  visual?: { type: 'risk-curve' | 'stats-fragilidade' | 'custo-reconstrucao'; caption?: string };
  heroImage?: { src: string; alt?: string };
  /** Trilha assistencial: oculta diagrama de camadas; foco em texto e evidência. */
  architectureMinimal?: boolean;
  /** Trilha assistencial: oculta grelha de sistemas; foco narrativo. */
  integrationMinimal?: boolean;
  /** Jornada clínica como sequência de etapas (diagrama com rupturas). */
  journeyStages?: string[];
  /** Comparação “pergunta antiga” vs “pergunta nova” (Governança). */
  governanceCompare?: { before: string; after: string };
  /** Roadmap como lista de transformações (De → Para). */
  roadmapTransform?: boolean;
  /** Narrativa: índice após o qual os bullets passam a segunda secção (ex.: verbos vs fricção). */
  bulletSplitAfter?: number;
  /** Highlight step: frase de atenção exibida com pulso após o body principal. */
  attentionPhrase?: string;
}

export interface PresentationStep {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  position: NodePosition;
  scale: number;
  kind: NodeKind;
  accent: Accent;
  content: StepContent;
}

export interface CameraState {
  x: number;
  y: number;
  scale: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface Connection {
  from: string;
  to: string;
  curvature?: number;
  dashed?: boolean;
}

export interface PresentationTheme {
  background: string;
  surface: string;
  accents: Record<Accent, { base: string; soft: string; strong: string }>;
}
