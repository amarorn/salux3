export type NodeKind =
  | "cover"
  | "narrative"
  | "architecture"
  | "journey"
  | "integration"
  | "governance"
  | "roadmap"
  | "highlight"
  | "capacities"
  | "pathways"
  | "agents-flow"
  | "results"
  | "closing";

export interface CapacityItem {
  name: string;
  subtitle?: string;
  description?: string;
  tagline: string;
  /** Captura de tela do produto — exibida ao expandir o card. */
  productImage?: string;
}

export interface ProductExample {
  caption: string;
  imageSrc: string;
  alt?: string;
}

export interface CapacityGroup {
  title: string;
  tone: "core" | "support";
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

export interface NewsItem {
  imageUrl: string;
  articleUrl: string;
  title?: string;
  source?: string;
}

export interface ContrastItem {
  /** Rótulo curto em caps (ex.: "VISÍVEL"). */
  label: string;
  /** Emoji ou caractere usado como ícone à esquerda do label. */
  icon?: string;
  /** Texto descritivo (pode usar \n para quebrar). */
  text: string;
  /** Tom visual — 'warm' (rose/amber, alerta) | 'cool' (cyan, silencioso). */
  tone?: "warm" | "cool";
}

export interface ContrastPair {
  left: ContrastItem;
  right: ContrastItem;
}

export type Accent = "violet" | "cyan" | "emerald" | "amber" | "rose" | "slate";

export interface ValueStage {
  /** Número exibido em destaque (ex.: "01"). */
  number: string;
  /** Rótulo curto em caps (ex.: "REGISTRO"). */
  label: string;
  /** Cor do cartão; default = acento do slide. */
  accent?: Accent;
  /** Descrição curta. Opcional — quando ausente, só o número + label aparecem. */
  description?: string;
  /** URL do mídia associada (ex.: vídeo ou imagem). */
  mediaUrl?: string;
  /** Matéria exibida ao clicar no box (imagem + link externo). */
  news?: NewsItem;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface NarrativeMetric {
  value: number;
  decimals?: number;
  suffix: string;
  /** Rótulo curto em caps exibido junto à métrica (ex.: "DE GLOSA"). */
  label?: string;
  /** Série numérica para o sparkline de tendência (mínimo 4 pontos). */
  trend?: number[];
  /** Preenchimento do donut ring (0–100). Default = value se este já estiver em 0–100. */
  ring?: number;
  /** Variação relativa exibida abaixo (ex.: 0.8 → "+0,8 pp", -1.2 → "−1,2 pp"). */
  delta?: number;
  /** Unidade do delta (default "pp"). */
  deltaUnit?: string;
  /** Unidade do valor principal (default "%"). Use "" para esconder. */
  unit?: string;
}

export interface BannerMedia {
  /** Vídeo do banner (loop muted). */
  videoSrc?: string;
  /** Poster do vídeo (também usado como imagem caso o vídeo falhe). */
  posterSrc?: string;
  /** Mostra o poster no banner; o vídeo só abre ao clicar (lightbox). */
  playOnClick?: boolean;
}

export type RoadmapSegment =
  | { type: "text"; text: string }
  | { type: "product"; name: string };

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
  visual?: {
    type: "risk-curve" | "stats-fragilidade" | "custo-reconstrucao";
    caption?: string;
  };
  /** `transparentCutout`: PNG com alpha — fundo do banner = app; sem vinheta pesada. */
  /** `lightenBlackMatte`: PNG com chapa preta — `mix-blend-mode: lighten` sobre fundo escuro (#05070d). */
  heroImage?: {
    src: string;
    alt?: string;
    transparentCutout?: boolean;
    lightenBlackMatte?: boolean;
  };
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
  /** Cor da caixa `attentionPhrase` (default: accent do slide). */
  attentionAccent?: Accent;
  /** Matéria com imagem, link e metadados (revelação sequencial + prévia). */
  newsItems?: NewsItem[];
  /** Trilha de ruptura acumulada: URLs de notícias relacionadas. */
  newsUrls?: string[];
  /** Notícias no banner superior (em vez da foto padrão); não duplicar em `newsUrls`. */
  bannerNewsUrls?: string[];
  /** Highlight step: insere visual "camadas acumuladas → base coordenada" antes da frase de atenção. */
  layersToBase?: boolean;
  /** Trilha Operação: headline grande + bullets como chips animados (pain points). */
  painPointsLayout?: boolean;
  /** Frase curta exibida entre o headline e a grid de pain points. */
  painPointsLead?: string;
  /** Ícones (lucide) em paralelo aos bullets — mesmo índice. */
  painPointsIcons?: string[];
  /** Número de colunas da grid (default 2). */
  painPointsGridCols?: 2 | 3 | 4;
  /** Camadas decorativas atrás dos chips: 'stacked' (acúmulo) | 'web' (teia tensa). */
  painPointsBackdrop?: "stacked" | "web";
  /** Substitui chips inline por botão central que abre balão flutuante com os tópicos. */
  painPointsBalloon?: boolean;
  /** Rótulo do botão que abre o balão flutuante (default: "Abrir os 7 pontos"). */
  painPointsTriggerLabel?: string;
  /** Título exibido no balão flutuante (default: "Onde o atrito aparece"). */
  painPointsBalloonTitle?: string;
  /** Pergunta de fechamento destacada ao final do card (CTA reflexivo). */
  closingQuestion?: string;
  /** Rótulo curto exibido acima da pergunta de fechamento (ex.: "CTA / PERGUNTA-GATILHO"). */
  closingQuestionLabel?: string;
  /** Mantém `closingQuestion` sem o botão "Ir para o formulário". */
  hideContactForm?: boolean;
  /** Slide só com pergunta (fonte do título) na parte inferior + CTA do formulário. */
  ctaFormSlide?: boolean;
  /** Encerramento: logo desce do topo para o centro da faixa inferior do card. */
  closingLogoFlight?: boolean;
  /** KPIs, métricas e chips de etapas em branco (números e rótulos). */
  allTextWhite?: boolean;
  /** Frases curtas a serem renderizadas como blocos de destaque verde (suporte/release). */
  highlightPhrases?: string[];
  /** Card de evidência com glow e métrica. */
  evidenceCard?: EvidenceCard;
  /** Frase de fechamento de tela em destaque ciano (call-out final do card). */
  closingHighlight?: string;
  /** Card 8 — capacidades centrais e de sustentação. */
  capacityGroups?: CapacityGroup[];
  /** Faixa com capturas de produto (substitui slide de “pontos de entrada”). */
  productExamples?: ProductExample[];
  /** Card 9 — caminhos: dor → produto. */
  pathways?: PathwayItem[];
  /** Card 10 — comparação antes/com INITIA + funções dos agentes. */
  beforeAfter?: { before: string[]; after: string[] };
  agentFunctions?: string[];
  /** Card 11 — cards de resultados. */
  resultsCards?: string[];
  /** Sem coluna de foto/banner no topo — só o painel de texto (layout vertical do card). */
  omitSidePhoto?: boolean;
  /** Esconde o visual decorativo do rodapé do cartão (`CardVisual` / “value flow”). */
  hideValueFlow?: boolean;
  /** Faixa de foto superior sem moldura (sem borda, sombra nem cantos arredondados). */
  bannerUnframed?: boolean;
  /** Altura Tailwind do banner (ex.: `h-[300px]`). */
  bannerHeightClass?: string;
  /** Esconde o arco SVG decorativo no fundo do painel de conteúdo do `FloatingCard`. */
  hideFloatingWatermarkSvg?: boolean;
  /** Vídeo no banner do card (substitui a foto lateral). */
  bannerMedia?: BannerMedia;
  /** Par de contraste (ex.: visível × despercebido) usado na capa. */
  contrastPair?: ContrastPair;
  /** Texto curto exibido logo abaixo do título (lead) — usado em capa e steps narrativos. */
  lead?: string;
  /** Revela cada parágrafo do `lead` por clique (separados por linha em branco). */
  leadByParagraph?: boolean;
  /** Exibe `body` logo abaixo do título (antes de etapas e métricas). */
  bodyAfterTitle?: boolean;
  /** Etapas numeradas em grid (4 colunas) — usadas em "ruptura acumulada". */
  valueStages?: ValueStage[];
  /** Texto curto exibido logo acima da grid de etapas (lead). */
  valueStagesLead?: string;
  /** Renderiza `description` de cada etapa direto no cartão (sem precisar expandir). */
  valueStagesShowDescription?: boolean;
  /** Renderiza valueStages como uma "estrada" curva — cada marco revela por clique e o último tem linha de chegada. */
  valueStagesRoad?: boolean;
  /** Cartões de "evidência numérica" — número grande com prefixo, manchete e contexto em itálico. */
  evidenceMetrics?: {
    /** Badge curta acima do número (ex.: "Dado · Evidência"). */
    badge?: string;
    /** Prefixo curto antes do número (ex.: "até"). */
    prefix?: string;
    /** Valor numérico (será animado em count-up). */
    value: number;
    /** Casas decimais (default 0). */
    decimals?: number;
    /** Unidade após o valor (default "%"). */
    unit?: string;
    /** Frase principal logo abaixo do número. */
    headline: string;
    /** Parágrafo em itálico (contexto/explicação). */
    context?: string;
    /** Estilo visual: 'bar' | 'gauge' | 'range' | 'highlight' (rótulo em destaque, sem gráfico). */
    style?: "bar" | "gauge" | "range" | "highlight";
    /** Texto em destaque (ex.: ano "2026" ou "Prioridade #1"); sobrepõe prefix+value no style highlight. */
    highlightLabel?: string;
    /** Anima o highlightLabel com efeito de digitação (style highlight). */
    highlightTypewriter?: boolean;
    /** Valor final do intervalo (apenas para style='range'). Quando definido, exibe "value a rangeEnd". */
    rangeEnd?: number;
    /** Rótulo curto após o número (ex.: "meses"). */
    valueLabel?: string;
    /** Valor máximo da escala (apenas para style='range'). Default 36. */
    rangeMax?: number;
  }[];
  /** Duas linhas de etapas — uma "positiva" (o que se faz), outra "negativa" (o que falha). */
  dualStages?: {
    positive: {
      lead: string;
      items: { label: string; description?: string }[];
      gridCols?: number;
    };
    negative: {
      lead: string;
      items: { label: string; description?: string }[];
      gridCols?: number;
    };
  };
  /** Desabilita o gradiente de intensidade entre etapas — usa estilo uniforme (ex.: 3 falhas equivalentes). */
  valueStagesFlat?: boolean;
  /** Número de colunas da grid de etapas (default = quantidade de etapas, em uma linha). */
  valueStagesGridCols?: 2 | 3 | 4 | 5;
  /** Quantas etapas revelar por clique (requer `forceEraStagedReveal` nas faixas do slide). */
  valueStagesRevealChunkSize?: number;
  /** Só os cartões `valueStages` contam como fases de clique; título, lead e métricas ficam sempre visíveis. */
  valueStagesRevealSequentialCards?: boolean;
  /** Com `valueStagesRevealSequentialCards`: primeiro clique só “liga” a linha; o 1.º cartão só aparece no clique seguinte. */
  valueStagesRevealFirstOnClick?: boolean;
  /** Com `valueStagesRevealSequentialCards`: um cartão por fase; o anterior some (não acumula na grelha). */
  valueStagesRevealOneAtATime?: boolean;
  /** Quando `false`, os cartões de `valueStages` são só informativos (sem ampliar ao clicar). Default: interativos. */
  valueStagesClickable?: boolean;
  /** Agrupa título do slide + grelha `valueStages` e centra o bloco no espaço vertical do painel (abaixo do banner). */
  centerTitleAndValueStagesInPanel?: boolean;
  /** Revelação por clique neste slide mesmo fora das trilhas era-agentica/operacoes. */
  forceEraStagedReveal?: boolean;
  /** Variante do visual decorativo no rodapé do card (default: 'flow'). */
  cardVisual?:
    | "flow"
    | "reveal"
    | "pattern"
    | "accumulation"
    | "late-reaction"
    | "transform"
    | "mesh"
    | "orbit"
    | "radar"
    | "entry-points"
    | "alignment"
    | "modular"
    | "signal"
    | "spotlight"
    | "bloom"
    | "compass"
    | "weave"
    | "ripple"
    | "tide"
    | "fragment"
    | "converge"
    | "ladder"
    | "branch"
    | "echo"
    | "scale"
    | "thread"
    | "bridge"
    | "heartbeat"
    | "magnet"
    | "prism"
    | "spiral"
    | "portal"
    | "lens"
    | "shield"
    | "gear"
    | "crystal"
    | "funnel"
    | "relay"
    | "fan"
    | "helix"
    | 'strata'
    | 'evolution'
    | 'scatter'
    | 'gap'
    | 'shatter'
    | 'rhizome'
    | 'ascent'
    | 'pillars'
    | 'constellation'
    | 'phase';
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
