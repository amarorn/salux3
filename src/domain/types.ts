export type NodeKind =
  | 'cover'
  | 'narrative'
  | 'architecture'
  | 'journey'
  | 'integration'
  | 'governance'
  | 'roadmap'
  | 'highlight'
  | 'capacities'
  | 'pathways'
  | 'agents-flow'
  | 'results'
  | 'closing';

export interface CapacityItem {
  name: string;
  subtitle: string;
  description?: string;
  tagline: string;
}

export interface CapacityGroup {
  title: string;
  tone: 'core' | 'support';
  items: CapacityItem[];
}

export interface PathwayItem {
  pain: string;
  product: string;
}

export interface EvidenceCard {
  label?: string;
  text: string;
  metric?: string;
}

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
  /** Highlight step: insere visual "camadas acumuladas → base coordenada" antes da frase de atenção. */
  layersToBase?: boolean;
  /** Trilha Operação: headline grande + bullets como chips animados (pain points). */
  painPointsLayout?: boolean;
  /** Camadas decorativas atrás dos chips: 'stacked' (acúmulo) | 'web' (teia tensa). */
  painPointsBackdrop?: 'stacked' | 'web';
  /** Substitui chips inline por botão central que abre balão flutuante com os tópicos. */
  painPointsBalloon?: boolean;
  /** Rótulo do botão que abre o balão flutuante (default: "Abrir os 7 pontos"). */
  painPointsTriggerLabel?: string;
  /** Título exibido no balão flutuante (default: "Onde o atrito aparece"). */
  painPointsBalloonTitle?: string;
  /** Pergunta de fechamento destacada ao final do card (CTA reflexivo). */
  closingQuestion?: string;
  /** Frases curtas a serem renderizadas como blocos de destaque verde (suporte/release). */
  highlightPhrases?: string[];
  /** Card de evidência com glow e métrica. */
  evidenceCard?: EvidenceCard;
  /** Frase de fechamento de tela em destaque ciano (call-out final do card). */
  closingHighlight?: string;
  /** Card 8 — capacidades centrais e de sustentação. */
  capacityGroups?: CapacityGroup[];
  /** Card 9 — caminhos: dor → produto. */
  pathways?: PathwayItem[];
  /** Card 10 — comparação antes/com INITIA + funções dos agentes. */
  beforeAfter?: { before: string[]; after: string[] };
  agentFunctions?: string[];
  /** Card 11 — cards de resultados. */
  resultsCards?: string[];
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
