import type { PresentationStep } from "./types";
import trilha2CoverUrl from "@/assets/presentation/trilha2-cover-paciente.png?url";
import trilha2JornadaUrl from "@/assets/presentation/trilha2-jornada-isometrica.png?url";
import trilha2ComandoUrl from "@/assets/presentation/trilha2-comando-clinico.png?url";
import trilha2RedeUrl from "@/assets/presentation/trilha2-rede-conectada.png?url";
import trilha2IntegracaoUrl from "@/assets/presentation/trilha2-integracao-rede.png?url";
import trilha2EvolucaoUrl from "@/assets/presentation/trilha2-evolucao-decisao.png?url";
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
 * Card de transição inserido entre `roadmap` e `closing` na trilha assistencial.
 * Apresenta o título principal, uma frase de leitura escalonada (efeito de
 * destaque) e uma frase de atenção em destaque com glow pulsante.
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
    headline: "INITIA · Agentes",
    cardVisual: "fan",
    contrastPair: {
      left: {
        label: "Sem INITIA",
        tone: "warm",
        text: "O usuário procura.\nInterpreta. Reconstrói contexto.\nDecide com visão parcial. Aciona tarde.",
      },
      right: {
        label: "Com INITIA",
        tone: "cool",
        text: "A informação se apresenta. O contexto acompanha.\nO risco é priorizado. O agente orienta.\nA ação parte do dado.",
      },
    },
    body: "O que os agentes fazem na jornada assistencial:",
    bullets: [
      "Estruturam dados críticos desde a admissão",
      "Sintetizam o prontuário e destacam riscos, alergias e restrições",
      "Mantêm contexto entre áreas e equipes ao longo das transições",
      "Acompanham áreas críticas e priorizam eventos",
      "Validam consistência entre registro, conduta e documentação",
      "Apoiam a organização da alta e a continuidade do pós-alta",
    ],
    attentionPhrase:
      "Os agentes não substituem a equipe. Ampliam a capacidade de leitura, priorização e decisão ao longo da jornada.",
    closingHighlight:
      "A tecnologia deixa de apenas registrar o cuidado — e passa a sustentar continuidade, visibilidade e capacidade real de decisão.",
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
      kind: "narrative",
      accent: "emerald",
      title: "A pergunta mudou.",
      subtitle: "Da posse do dado para a continuidade do contexto na decisão",
    }),
  )
  .map(
    withStep("roadmap", {
      kind: "capacities",
      accent: "cyan",
      title: "Essa arquitetura já existe na prática.",
      subtitle:
        "Ecossistema Salux: capacidades centrais e de sustentação da continuidade",
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
      cardVisual: "ripple",
      lead: "Na gravidade do caso?\nNa complexidade do paciente?\nOu no momento em que o cuidado perde continuidade?",
      contrastPair: {
        left: {
          label: "Evento visível",
          icon: "🔴",
          tone: "warm",
          text: "Complicação.\nErro identificado.\nEvento adverso registrado.",
        },
        right: {
          label: "Risco silencioso",
          icon: "🦊",
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
      headline: "Acúmulo",
      cardVisual: "fragment",
      valueStagesLead:
        "Na maioria das vezes, o risco se forma em rupturas pequenas — que ninguém percebe isoladamente:",
      valueStagesFlat: true,
      valueStagesGridCols: 3,
      valueStages: [
        {
          number: "📋",
          label: "Informação",
          description: "Que não chega completa.",
        },
        {
          number: "🔁",
          label: "Histórico",
          description: "Que precisa ser reconstruído a cada etapa.",
        },
        {
          number: "🔀",
          label: "Transição",
          description: "Entre áreas sem contexto preservado.",
        },
        {
          number: "🧩",
          label: "Decisão",
          description: "Tomada com visão parcial do caso.",
        },
        {
          number: "🚪",
          label: "Alta",
          description: "Que encerra o vínculo antes de encerrar o cuidado.",
        },
      ],
      body: "Cada ruptura parece administrável. Mas elas se somam ao longo da jornada — e o risco cresce antes de se tornar visível.",
      attentionPhrase:
        "Não falta dado. Falta continuidade entre o dado e a decisão certa, no momento certo.",
      bullets: [],
      metrics: undefined,
      heroImage: {
        src: trilha2JornadaUrl,
        alt: "Jornada assistencial conectando recepção, consultório, exames e enfermaria",
      },
    }),
  )
  .map(
    withContent("why-agents", {
      headline: "Continuidade decisória",
      cardVisual: "weave",
      metrics: [],
      bullets: [],
      bulletSplitAfter: undefined,
      dualStages: {
        positive: {
          lead: "O que a operação faz todos os dias:",
          gridCols: 7,
          items: [
            { label: "Registra" },
            { label: "Documenta" },
            { label: "Atende" },
            { label: "Prescreve" },
            { label: "Executa" },
            { label: "Encaminha" },
            { label: "Dá alta" },
          ],
        },
        negative: {
          lead: "O que acontece entre essas etapas:",
          gridCols: 3,
          items: [
            { label: "Informações não chegam completas" },
            { label: "Contexto clínico é reconstruído a cada transição" },
            { label: "Áreas operam com leituras diferentes do mesmo caso" },
          ],
        },
      },
      attentionPhrase:
        "A operação sustenta o cuidado todos os dias. Mas ainda não sustenta continuidade de decisão ao longo da jornada.",
      heroImage: {
        src: trilha2RedeUrl,
        alt: "Rede assistencial conectada a um centro de comando clínico",
      },
    }),
  )
  .map(
    withContent("architecture", {
      headline: "Evidência",
      cardVisual: "magnet",
      lead: "Esse padrão não é percepção. Aparece nos números:",
      metrics: [],
      bullets: [],
      architectureMinimal: true,
      evidenceMetrics: [
        {
          badge: "Dado · Evidência",
          prefix: "até",
          value: 80,
          unit: "%",
          headline:
            "dos eventos adversos graves podem estar associados a falhas nas transições de cuidado.",
          context:
            "A transição entre áreas não é apenas passagem de paciente. É um ponto crítico de segurança — onde o contexto se perde e o risco se forma.",
        },
        {
          badge: "Dado · Evidência",
          prefix: "até",
          value: 15,
          unit: "%",
          headline:
            "dos pacientes em áreas críticas podem apresentar complicações não detectadas imediatamente.",
          context:
            "Em recuperação pós-anestésica, UTI e leitos monitorados, o risco muda rápido. Quando a visibilidade chega tarde, parte do dano já aconteceu.",
        },
      ],
      body: "Esses dados não falam apenas de eventos. Eles mostram uma fragilidade estrutural.",
      attentionPhrase:
        "Quando o contexto se perde, o risco cresce em silêncio. E quando se torna visível, parte dele já se materializou.",
      heroImage: {
        src: trilha2ComandoUrl,
        alt: "Equipe clínica analisando painéis de operação em centro de comando",
      },
    }),
  )
  .map(
    withContent("journey", {
      headline: "Jornada",
      cardVisual: "thread",
      journeyStages: [],
      lead: "Cada etapa parece resolvida isoladamente. Mas o cuidado não acontece em etapas isoladas.",
      valueStagesFlat: true,
      valueStagesGridCols: 5,
      valueStages: [
        { number: "01", label: "Admissão" },
        { number: "02", label: "Atendimento" },
        { number: "03", label: "Transição entre áreas" },
        { number: "04", label: "Centro cirúrgico" },
        { number: "05", label: "Recuperação" },
        { number: "06", label: "Documentação" },
        { number: "07", label: "Operação assistencial" },
        { number: "08", label: "Alta" },
        { number: "09", label: "Pós-alta" },
      ],
      body: "Quando a continuidade não é sustentada entre essas etapas, a jornada passa a depender de repasses manuais, memória individual e reconstrução constante de contexto.",
      attentionPhrase:
        "O cuidado depende de continuidade entre as etapas. Não apenas de qualidade dentro delas.",
      closingQuestionLabel: "CTA · Pergunta-gatilho",
      closingQuestion:
        "Em qual ponto da jornada o cuidado perde mais continuidade na sua instituição?",
      bullets: [],
    }),
  )
  .map(
    withContent("integration", {
      headline: "Continuidade operacional",
      cardVisual: "crystal",
      lead: "As equipes sabem cuidar. O problema está na forma como a operação está organizada.",
      contrastPair: {
        left: {
          label: "O que a saúde avançou",
          tone: "cool",
          text: "Registrar e armazenar informação.\nDigitalizar processos.\nIntegrar sistemas.",
        },
        right: {
          label: "O que ainda falta",
          tone: "warm",
          text: "Fazer com que a informação certa acompanhe a jornada no momento em que a decisão precisa ser tomada.",
        },
      },
      body: "Registrar informação não significa preservar contexto.\nPreservar contexto não significa apenas integrar sistemas.",
      attentionPhrase:
        "O limite não está na ausência de tecnologia. Está na ausência de uma base capaz de transformar informação dispersa em clareza clínica e ação coordenada.",
      bullets: [],
      heroImage: {
        src: trilha2IntegracaoUrl,
        alt: "Integração da rede assistencial em torno de um centro de operações clínicas",
      },
    }),
  )
  .map(
    withContent("governance", {
      headline: "A pergunta mudou.",
      cardVisual: "prism",
      contrastPair: {
        left: {
          label: "Antes",
          tone: "warm",
          text: "Onde a informação está registrada?",
        },
        right: {
          label: "Agora",
          tone: "cool",
          text: "O contexto certo acompanha a decisão no momento em que ela acontece?",
        },
      },
      body: "Isso exige uma mudança de lógica na base da operação:",
      beforeAfter: {
        before: [
          "Registro",
          "Etapa isolada",
          "Leitura tardia",
          "Reação ao risco",
          "Esforço individual de compensação",
        ],
        after: [
          "Contexto preservado",
          "Jornada coordenada",
          "Visibilidade durante a execução",
          "Antecipação coordenada",
          "Suporte estruturado à decisão",
        ],
      },
      attentionPhrase:
        "A mudança não está em digitalizar mais uma etapa. Está em sustentar continuidade ao longo de toda a jornada.",
      bullets: [],
      revealPillars: [],
      heroImage: {
        src: trilha2EvolucaoUrl,
        alt: "Evolução do registro para a decisão sustentada ao longo da jornada",
      },
    }),
  )
  .map(
    withContent("roadmap", {
      headline: "Essa arquitetura já existe na prática.",
      cardVisual: "branch",
      body: "O Ecossistema Salux estrutura a continuidade em cada ponto da jornada — de forma integrada, não como soluções isoladas.",
      capacityGroups: [
        {
          title: "Capacidades centrais da continuidade",
          tone: "core",
          items: [
            {
              name: "Base clínica",
              subtitle: "Plataforma Salux + INITIA",
              description:
                "Núcleo que organiza dados, fluxos, registros e contexto clínico.",
              tagline: "O caso deixa de ser reconstruído a cada etapa.",
            },
            {
              name: "Diagnóstico integrado",
              subtitle: "Med.Place",
              description:
                "Exame, laudo e contexto conectados à linha do cuidado.",
              tagline:
                "Diagnóstico como infraestrutura crítica da jornada — não serviço apartado.",
            },
            {
              name: "Cuidado conectado",
              subtitle: "CloudHealth",
              description:
                "Crônicos, pós-cirúrgicos e pacientes em recuperação acompanhados com vínculo e resposta.",
              tagline: "A continuidade não termina na alta.",
            },
            {
              name: "Áreas críticas",
              subtitle: "SkyMed · VisionPilot · AGCOM",
              description:
                "Registro anestésico estruturado e rastreabilidade contínua.",
              tagline: "O risco acompanhado enquanto o cuidado acontece.",
            },
          ],
        },
        {
          title: "Capacidades de sustentação da continuidade",
          tone: "support",
          items: [
            {
              name: "Governança documental",
              subtitle: "ZeroDox",
              description:
                "Documentação que sustenta rastreabilidade, conformidade e continuidade.",
              tagline: "Deixa de ser ponto de fragilidade.",
            },
            {
              name: "Força de trabalho",
              subtitle: "StarGrid",
              description:
                "Escala, cobertura e disponibilidade alinhadas ao risco e ao fluxo assistencial.",
              tagline: "Equipe como capacidade coordenada.",
            },
            {
              name: "Inteligência operacional",
              subtitle: "VisionPilot",
              description:
                "Fluxos físicos, ocupação e sinais do ambiente acompanhados em tempo real.",
              tagline: "O risco que não aparece no prontuário.",
            },
          ],
        },
      ],
      bullets: [],
      roadmapTransform: false,
    }),
  )
  .map(
    withContent("closing", {
      headline:
        "O cuidado deixa de depender de reconstrução. E passa a ter continuidade real.",
      cardVisual: "bloom",
      body: "Com uma base coordenada, a jornada deixa de depender de esforço individual de compensação.",
      valueStagesFlat: true,
      valueStagesGridCols: 3,
      valueStages: [
        {
          number: "✓",
          label: "Mais previsibilidade sobre a jornada e os riscos",
        },
        { number: "✓", label: "Mais clareza clínica no momento da decisão" },
        {
          number: "✓",
          label: "Mais continuidade entre áreas, equipes e momentos",
        },
        { number: "✓", label: "Menos retrabalho e reconstrução de contexto" },
        { number: "✓", label: "Menos variabilidade e exposição assistencial" },
        {
          number: "✓",
          label: "Mais capacidade de antecipar risco antes que se materialize",
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
