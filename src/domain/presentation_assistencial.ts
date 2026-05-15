import type { PresentationStep } from "./types";
import trilha2CoverUrl from "@/assets/presentation/trilha2-cover-paciente.png?url";
import news1Url from "@/assets/presentation/news-1.png?url";
import news2Url from "@/assets/presentation/news-2.png?url";
import { steps as baseSteps } from "./presentation";

export const presentationAssistencialMeta = {
  title: "Assistência",
  subtitle:
    "Continuidade do cuidado, contexto clínico e decisão ao longo da jornada",
  author: "",
};

function withContent(
  id: PresentationStep["id"],
  patch: Partial<PresentationStep["content"]>,
) {
  return (s: PresentationStep): PresentationStep =>
    s.id === id ? { ...s, content: { ...s.content, ...patch } } : s;
}

function withStep(
  id: PresentationStep["id"],
  patch: Partial<PresentationStep>,
) {
  return (s: PresentationStep): PresentationStep =>
    s.id === id
      ? {
          ...s,
          ...patch,
          content: { ...s.content, ...(patch.content ?? {}) },
        }
      : s;
}

/**
 * Slide extra antes do encerramento — mesmo padrão visual da trilha Receita
 * (`entry-points`): grelha de cartões + pergunta de fechamento.
 */
const highlightContextStep: PresentationStep = {
  id: "highlight-context",
  index: 8,
  title:
    "Com o INITIA, a informação deixa de ser consultada e passa a sustentar a decisão.",
  subtitle: "Agentes que sustentam a continuidade decisória",
  position: { x: -560, y: -1480 },
  scale: 1.25,
  kind: "narrative",
  accent: "emerald",
  content: {
    headline: "Pontos de entrada",
    omitSidePhoto: true,
    cardVisual: "entry-points",
    valueStagesFlat: true,
    valueStagesGridCols: 3,
    valueStages: [
      {
        number: "01",
        label: "Admissão e triagem",
        description: "→ Dados críticos estruturados desde o primeiro contato",
      },
      {
        number: "02",
        label: "Prontuário vivo",
        description: "→ Sintese, riscos e restrições sempre visíveis",
      },
      {
        number: "03",
        label: "Transições",
        description: "→ Contexto preservado entre áreas e equipes",
      },
      {
        number: "04",
        label: "Áreas críticas",
        description: "→ Priorização de eventos e leitura contínua",
      },
      {
        number: "05",
        label: "Documentação",
        description: "→ Consistência entre registro, conduta e evidência",
      },
      {
        number: "06",
        label: "Alta e pós-alta",
        description: "→ Continuidade após o encerramento do episódio",
      },
    ],
    closingQuestionLabel: "CTA · Pergunta-gatilho",
    closingQuestion:
      "Em qual desses pontos a sua instituição perde mais continuidade hoje?",
  },
};

const assistencialBaseSteps: PresentationStep[] = baseSteps
  .map((s) => ({ ...s, content: { ...s.content } }))
  .map((s) =>
    s.id === "cover"
      ? {
          ...s,
          accent: "emerald" as const,
          title: "Onde o risco assistencial começa a se formar?",
          subtitle: "Assistência",
        }
      : s,
  )
  .map(
    withStep("limit", {
      accent: "rose",
      title: "O risco não começa com um erro grave. Ele se acumula.",
      subtitle: "Rupturas pequenas que ninguém percebe isoladamente",
    }),
  )
  .map(
    withStep("why-agents", {
      accent: "emerald",
      title: "A instituição registra. Mas algo se perde ao longo da jornada.",
      subtitle: "Registrar não é o mesmo que sustentar continuidade decisória",
    }),
  )
  .map(
    withStep("architecture", {
      kind: "narrative",
      accent: "amber",
      title: "Quando o contexto se perde, o risco cresce em silêncio.",
      subtitle: "Evidência: o padrão aparece nos números",
    }),
  )
  .map(
    withStep("journey", {
      kind: "narrative",
      accent: "cyan",
      title:
        "A ruptura não acontece em um único ponto. Ela se forma ao longo da jornada.",
      subtitle:
        "Cada etapa parece resolvida isoladamente — mas o cuidado depende de continuidade",
    }),
  )
  .map(
    withStep("integration", {
      kind: "narrative",
      accent: "emerald",
      title:
        "Não é um problema de competência clínica. É um problema de continuidade operacional.",
      subtitle: "As equipes sabem cuidar — falta sustentar continuidade",
    }),
  )
  .map(
    withStep("governance", {
      kind: "capacities",
      accent: "cyan",
      title: "Essa arquitetura já existe na prática.",
      subtitle:
        "Ecossistema Salux: capacidades centrais e de sustentação da continuidade",
    }),
  )
  .map(
    withStep("roadmap", {
      kind: "narrative",
      accent: "emerald",
      title: "A tecnologia deixa de registrar e passa a atuar.",
      subtitle:
        "Sem INITIA × Com INITIA — contexto vivo em vez de reconstrução",
    }),
  )
  .map(
    withStep("closing", {
      accent: "emerald",
      title:
        "O cuidado deixa de depender de reconstrução. E passa a ter continuidade real.",
      subtitle:
        "Resultado: base coordenada, continuidade clínica e capacidade real de decisão",
    }),
  )
  .map(
    withContent("cover", {
      headline: "Abertura",
      cardVisual: "reveal",
      lead: "Na gravidade do caso?\nNa complexidade do paciente?\nOu no momento em que o cuidado perde continuidade?",
      contrastPair: {
        left: {
          label: "Evento visível",
          icon: "👁",
          tone: "warm",
          text: "Complicação.\nErro identificado.\nEvento adverso registrado.",
        },
        right: {
          label: "Risco silencioso",
          icon: "🌫",
          tone: "cool",
          text: "Contexto que se perde.\nDecisão com visão parcial.\nRisco crescendo antes de aparecer.",
        },
      },
      body: "Em saúde, o risco nem sempre nasce de um evento isolado. Muitas vezes, ele se forma aos poucos — e em silêncio.",
      attentionPhrase:
        "O problema não é falta de dado. É falta de continuidade.",
      heroImage: {
        src: trilha2CoverUrl,
        alt: "Médica acompanhando paciente em leito hospitalar",
      },
    }),
  )
  .map(
    withContent("limit", {
      headline: "Diagnóstico",
      omitSidePhoto: true,
      cardVisual: "pattern",
      metrics: [
        {
          value: 80,
          decimals: 0,
          label: "Eventos adversos graves",
          suffix:
            "podem estar associados a falhas nas transições de cuidado — onde o contexto se perde.",
          ring: 80,
          trend: [52, 58, 61, 65, 69, 72, 76, 80],
          delta: 4,
          deltaUnit: "pp",
        },
        {
          value: 15,
          decimals: 0,
          label: "Áreas críticas",
          suffix:
            "dos pacientes podem apresentar complicações não detectadas imediatamente quando a visibilidade chega tarde.",
          ring: 15,
          trend: [6, 7, 8, 9, 10, 11, 13, 15],
          delta: 2.2,
          deltaUnit: "pp",
        },
      ],
      body: "Cada ruptura parece administrável. Mas elas se somam ao longo da jornada — e o risco cresce antes de se tornar visível.",
      attentionPhrase:
        "Não falta dado. Falta continuidade entre o dado e a decisão certa, no momento certo.",
      newsUrls: [news1Url, news2Url],
      bullets: [],
      valueStages: [],
      valueStagesLead: undefined,
      valueStagesFlat: undefined,
      valueStagesGridCols: undefined,
      heroImage: undefined,
    }),
  )
  .map(
    withContent("why-agents", {
      headline: "Acúmulo",
      cardVisual: "accumulation",
      valueStagesLead:
        "Ao longo da jornada assistencial, o risco de perda de continuidade passa por quatro rupturas típicas:",
      valueStagesFlat: true,
      valueStagesGridCols: 4,
      valueStages: [
        {
          number: "01",
          label: "Informação",
          description: "Incompleta ou dispersa na origem.",
        },
        {
          number: "02",
          label: "Transição",
          description: "Contexto reconstruído a cada mudança de área.",
        },
        {
          number: "03",
          label: "Decisão",
          description: "Tomada com leitura parcial do caso.",
        },
        {
          number: "04",
          label: "Continuidade",
          description: "Que se rompe antes do cuidado encerrar de fato.",
        },
      ],
      body: "Cada ruptura parece administrável isoladamente. Mas elas se acumulam — e o risco aparece tarde, quando parte do dano já ocorreu.",
      attentionPhrase:
        "São pequenas rupturas que se somam e corroem a segurança e a qualidade do cuidado.",
      metrics: [],
      bullets: [],
      dualStages: undefined,
      bulletSplitAfter: undefined,
      heroImage: undefined,
    }),
  )
  .map(
    withContent("architecture", {
      headline: "Modelo reativo",
      cardVisual: "late-reaction",
      valueStagesFlat: true,
      valueStages: [
        {
          number: "✕",
          label: "Correção tardia",
          description: "Quando o evento já se materializou na jornada.",
        },
        {
          number: "✕",
          label: "Leitura fragmentada",
          description: "Quando cada área vê só um pedaço do caso.",
        },
        {
          number: "✕",
          label: "Registro sem condução",
          description: "O dado existe — a decisão coordenada não vem.",
        },
      ],
      body: "No curto prazo, a equipe compensa. Mas o esforço custa tempo, custa gente e aumenta exposição assistencial.",
      attentionPhrase:
        "Grande parte do esforço acontece tarde demais. O custo de corrigir é maior que o custo de prevenir.",
      metrics: [],
      bullets: [],
      lead: undefined,
      architectureMinimal: false,
      evidenceMetrics: [],
      heroImage: undefined,
    }),
  )
  .map(
    withContent("journey", {
      headline: "Virada de lógica",
      omitSidePhoto: true,
      cardVisual: "transform",
      contrastPair: {
        left: {
          label: "Antes",
          tone: "warm",
          text: "O cuidado é reativo — reconstrói contexto depois que o risco já avançou.",
        },
        right: {
          label: "Depois",
          tone: "cool",
          text: "O cuidado é contínuo — contexto e decisão acompanham a jornada enquanto ela acontece.",
        },
      },
      body: "Essa virada exige uma mudança na forma como a operação é estruturada:",
      beforeAfter: {
        before: [
          "Registro disperso",
          "Etapa isolada",
          "Leitura tardia",
          "Reação ao evento",
          "Esforço individual de compensação",
        ],
        after: [
          "Contexto preservado",
          "Jornada coordenada",
          "Visibilidade na execução",
          "Antecipação coordenada",
          "Suporte estruturado à decisão",
        ],
      },
      attentionPhrase:
        "O cuidado precisa ser sustentado enquanto acontece — não recuperado depois que o contexto se perdeu.",
      journeyStages: [],
      lead: undefined,
      valueStages: [],
      valueStagesFlat: undefined,
      valueStagesGridCols: undefined,
      closingQuestion: undefined,
      closingQuestionLabel: undefined,
      bullets: [],
    }),
  )
  .map(
    withContent("integration", {
      headline: "Base coordenada",
      omitSidePhoto: true,
      cardVisual: "mesh",
      valueStagesLead:
        "A continuidade assistencial depende de como a operação funciona como um todo — da admissão ao pós-alta.\n\nSeis capacidades que precisam operar de forma coordenada:",
      valueStagesFlat: true,
      valueStagesGridCols: 3,
      valueStages: [
        {
          number: "01",
          label: "Base clínica",
          description: "Origem estruturada da informação e do contexto.",
        },
        {
          number: "02",
          label: "Fluxo assistencial",
          description: "Acompanhamento contínuo da jornada.",
        },
        {
          number: "03",
          label: "Governança documental",
          description: "Evidência e rastreabilidade ao longo do cuidado.",
        },
        {
          number: "04",
          label: "Força de trabalho",
          description: "Escala, cobertura e disponibilidade alinhadas ao risco.",
        },
        {
          number: "05",
          label: "Áreas críticas",
          description: "Alta complexidade com leitura em tempo real.",
        },
        {
          number: "06",
          label: "Inteligência operacional",
          description: "A operação acompanhada enquanto acontece.",
        },
      ],
      body: "Registrar informação não substitui preservar contexto.\nIntegrar sistemas não substitui coordenar a decisão na jornada.",
      attentionPhrase:
        "Esses elementos não operam de forma independente. Quando um falha, a continuidade se rompe nos outros.",
      lead: undefined,
      contrastPair: undefined,
      bullets: [],
      heroImage: undefined,
    }),
  )
  .map(
    withContent("governance", {
      headline: "Essa arquitetura já existe na prática.",
      cardVisual: "orbit",
      body: "O Ecossistema Salux estrutura a continuidade em cada ponto da jornada — de forma integrada, não como soluções isoladas.",
      capacityGroups: [
        {
          title: "Capacidades centrais da continuidade",
          tone: "core",
          items: [
            {
              name: "Base clínica",
              description:
                "Núcleo que organiza dados, fluxos, registros e contexto clínico.",
              tagline: "O caso deixa de ser reconstruído a cada etapa.",
            },
            {
              name: "Diagnóstico integrado",
              description:
                "Exame, laudo e contexto conectados à linha do cuidado.",
              tagline:
                "Diagnóstico como infraestrutura crítica da jornada — não serviço apartado.",
            },
            {
              name: "Cuidado conectado",
              description:
                "Crônicos, pós-cirúrgicos e recuperação com vínculo e resposta.",
              tagline: "A continuidade não termina na alta.",
            },
          ],
        },
        {
          title: "Capacidades de sustentação da continuidade",
          tone: "support",
          items: [
            {
              name: "Áreas críticas",
              description:
                "Registro anestésico estruturado, rastreabilidade e leitura em tempo real do ambiente.",
              tagline: "O risco acompanhado enquanto o cuidado acontece.",
            },
            {
              name: "Governança documental",
              description:
                "Documentação que sustenta rastreabilidade, conformidade e continuidade.",
              tagline: "Deixa de ser ponto de fragilidade.",
            },
            {
              name: "Força de trabalho",
              description:
                "Escala, cobertura e disponibilidade alinhadas ao risco e ao fluxo assistencial.",
              tagline: "Equipe como capacidade coordenada.",
            },
          ],
        },
      ],
      contrastPair: undefined,
      beforeAfter: undefined,
      revealPillars: [],
      bullets: [],
      heroImage: undefined,
    }),
  )
  .map(
    withContent("roadmap", {
      headline: "Agentes",
      omitSidePhoto: true,
      cardVisual: "radar",
      contrastPair: {
        left: {
          label: "Sem INITIA",
          tone: "warm",
          text: "A operação registra. A equipe interpreta. O contexto se perde entre etapas. O retrabalho começa.",
        },
        right: {
          label: "Com INITIA",
          tone: "cool",
          text: "O agente sintetiza, prioriza e aciona. O risco aparece antes de se materializar. A decisão parte com contexto.",
        },
      },
      body: "O que os agentes fazem na jornada assistencial:",
      bullets: [
        "Estruturam dados críticos desde a admissão",
        "Sintetizam o prontuário e destacam riscos, alergias e restrições",
        "Mantêm contexto entre áreas e equipes ao longo das transições",
        "Acompanham áreas críticas e priorizam eventos",
        "Validam consistência entre registro, conduta e documentação",
      ],
      attentionPhrase:
        "Os agentes não substituem a equipe. Ampliam leitura, priorização e decisão ao longo da jornada.",
      capacityGroups: [],
      roadmapTransform: false,
    }),
  )
  .map(
    withContent("closing", {
      headline:
        "O cuidado deixa de depender de reconstrução. E passa a ter continuidade real.",
      cardVisual: "flow",
      body: "Com uma base coordenada, a jornada deixa de depender de esforço individual de compensação.",
      valueStagesFlat: true,
      valueStagesGridCols: 3,
      valueStages: [
        {
          number: "✓",
          label: "Mais previsibilidade sobre a jornada e os riscos",
          description: "",
        },
        {
          number: "✓",
          label: "Mais clareza clínica no momento da decisão",
          description: "",
        },
        {
          number: "✓",
          label: "Mais continuidade entre áreas, equipes e momentos",
          description: "",
        },
        {
          number: "✓",
          label: "Menos retrabalho e reconstrução de contexto",
          description: "",
        },
        {
          number: "✓",
          label: "Menos variabilidade e exposição assistencial",
          description: "",
        },
        {
          number: "✓",
          label: "Mais capacidade de antecipar risco antes que se materialize",
          description: "",
        },
      ],
      attentionPhrase:
        "O valor não está em registrar melhor. Está em sustentar o cuidado com contexto vivo ao longo da jornada.",
      closingHighlight:
        "Ecossistema Salux · A base para uma nova forma de operar a saúde.",
      bullets: [],
    }),
  );

/**
 * Insere o card de transição (`highlight-context`) imediatamente antes do
 * `closing` e re-indexa o array para manter `step.index` sequencial.
 */
export const assistencialSteps: PresentationStep[] = (() => {
  const closingIdx = assistencialBaseSteps.findIndex((s) => s.id === "closing");
  if (closingIdx < 0) return assistencialBaseSteps;
  const next = [
    ...assistencialBaseSteps.slice(0, closingIdx),
    highlightContextStep,
    ...assistencialBaseSteps.slice(closingIdx),
  ];
  return next.map((step, index) => ({ ...step, index }));
})();

export const assistencialStepsById: Record<string, PresentationStep> =
  Object.fromEntries(assistencialSteps.map((s) => [s.id, s]));
