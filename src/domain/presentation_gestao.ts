import type { PresentationStep } from "./types";
import { steps as baseSteps } from "./presentation";
import gestaoSlide1NoticiaCnn from "@/assets/presentation/gestao-slide1-noticia-cnn.png?url";
import gestaoSlide1NoticiaSobrasp from "@/assets/presentation/gestao-slide1-noticia-sobrasp.png?url";
import gestaoSlide1NoticiaDefato from "@/assets/presentation/gestao-slide1-noticia-defato.png?url";
import gestaoSlide2Ecossistema from "@/assets/presentation/gestao-slide2-ecossistema.png?url";
import gestaoSlide3FilaRede from "@/assets/presentation/gestao-slide3-fila-rede.png?url";
import gestaoSlide4Comando from "@/assets/presentation/gestao-slide4-comando.png?url";
import gestaoSemTituloPosterUrl from "@/assets/intro/gestao-sem-titulo-poster.jpg?url";
import gestao8PosterUrl from "@/assets/intro/gestao-8-poster.jpg?url";
import gestaoSlide9ResultadoUrl from "@/assets/presentation/gestao-slide9-resultado.png?url";

export const presentationGestaoMeta = {
  title: "Gestão da operação em saúde",
  subtitle: "Coordenação de rede, capacidade instalada e decisão sob risco",
  author: "",
};

function cloneSteps(steps: PresentationStep[]): PresentationStep[] {
  return steps.map((s) => ({
    ...s,
    content: { ...s.content },
  }));
}

/** Trilha Gestão / Pública: coordenação de rede, previsibilidade e
 *  enxergar melhor com o recurso certo. */
const gestaoBaseSteps: PresentationStep[] = cloneSteps(baseSteps).map((s) => {
  // SLIDE 1 — Sinais de pressão na rede
  if (s.id === "cover") {
    return {
      ...s,
      kind: "narrative" as const,
      accent: "rose" as const,
      title:
        "Quando a pressão assistencial supera a capacidade de coordenação da rede?",
      subtitle: "Sinais de uma rede que opera sob carga",
      content: {
        headline: "Gestão",
        cardVisual: "heartbeat",
        lead: "Sua rede reconhece algum destes sinais?",
        valueStagesFlat: true,
        valueStagesGridCols: 3,
        valueStagesRevealChunkSize: 3,
        allTextWhite: true,
        valueStages: [
          { number: "📋", label: "Filas regulatórias crescentes" },
          { number: "🔗", label: "Gargalos entre níveis assistenciais" },
          { number: "⏳", label: "Demora no acesso ao cuidado" },
          { number: "📊", label: "Baixa visibilidade sobre a rede" },
          { number: "⚖️", label: "Judicialização crescendo" },
          {
            number: "🔁",
            label: "Decisões dependentes de controles paralelos",
          },
        ],
        bannerNewsUrls: [
          gestaoSlide1NoticiaCnn,
          gestaoSlide1NoticiaSobrasp,
          gestaoSlide1NoticiaDefato,
        ],
        attentionPhrase:
          "O desafio não é atender mais. É coordenar melhor o que a rede já precisa sustentar.",
      },
    };
  }

  // SLIDE 2 — A rede segue operando, mas perde previsibilidade
  if (s.id === "limit") {
    return {
      ...s,
      kind: "narrative",
      accent: "cyan",
      title: "A rede segue operando. Mas perde previsibilidade.",
      subtitle: "Sinais isolados que expressam um mesmo desequilíbrio",
      content: {
        headline: "Diagnóstico",
        cardVisual: "converge",
        lead: "Os sinais estão espalhados por toda a rede — e costumam ser tratados como problemas isolados. Na prática, são a expressão visível de um único desequilíbrio:",
        attentionPhrase:
          "A rede cresce em demanda e complexidade. A coordenação não cresce na mesma proporção.",
        heroImage: {
          src: gestaoSlide2Ecossistema,
          alt: "Ecossistema integrado de capacidades na operação em saúde",
        },
        body: "O que acontece quando isso não é corrigido:",
        bullets: [
          "Filas deixam de ser fluxo e se tornam passivo assistencial",
          "Diagnósticos tardios elevam a complexidade clínica e o custo",
          "A judicialização cresce como resposta à falha de acesso",
          "A capacidade instalada é usada de forma desigual",
          "O gasto público financia resposta tardia e retrabalho",
        ],
        closingHighlight:
          "Em saúde pública, adiar decisões raramente preserva recursos. Desloca o problema para um estágio mais caro e mais difícil de corrigir.",
        metrics: [],
      },
    };
  }

  // SLIDE 3 — Quando a coordenação falha, o desperdício vira sistêmico
  if (s.id === "why-agents") {
    return {
      ...s,
      kind: "narrative",
      accent: "amber",
      title: "Quando a coordenação falha, o desperdício também vira sistêmico.",
      subtitle: "Evidência: desperdício global e filas no SUS",
      content: {
        headline: "Evidência sistêmica",
        cardVisual: "echo",
        contrastPair: {
          left: {
            label: "US$ 1,9 tri / ano",
            tone: "cool",
            text: "Desperdício global estimado associado à falta de coordenação sistêmica (OECD).\nA ineficiência não nasce apenas do gasto excessivo — nasce da dificuldade de coordenar recursos, fluxos e decisões.",
          },
          right: {
            label: "Filas no SUS",
            tone: "cool",
            text: "Milhões de pessoas aguardam atendimento sem priorização orientada por risco clínico.\nFila não é apenas volume acumulado — é perda de capacidade de organizar acesso, risco e prioridade.",
          },
        },
        closingQuestion:
          "Qual é o % de capacidade instalada que sua rede usa de forma desigual hoje?",
        hideContactForm: true,
        heroImage: {
          src: gestaoSlide3FilaRede,
          alt: "Fila e pressão na rede de saúde — demanda versus capacidade de coordenação",
        },
        bullets: [],
      },
    };
  }

  // SLIDE 4 — A pergunta mudou (DE → PARA)
  if (s.id === "architecture") {
    return {
      ...s,
      kind: "narrative",
      accent: "emerald",
      title: "A pergunta mudou.",
      subtitle:
        "De atender mais para coordenar melhor o que a rede já sustenta",
      content: {
        headline: "Virada de lógica",
        cardVisual: "portal",
        contrastPair: {
          left: {
            label: "Antes",
            tone: "warm",
            text: "Como atender mais?",
          },
          right: {
            label: "Agora",
            tone: "cool",
            text: "Como coordenar melhor o que a rede já precisa sustentar?",
          },
        },
        body: "Isso exige uma mudança de lógica operacional:",
        beforeAfter: {
          before: [
            "Unidade",
            "Fila cronológica",
            "Controle paralelo",
            "Resposta tardia",
          ],
          after: [
            "Rede coordenada",
            "Priorização por criticidade",
            "Leitura integrada",
            "Antecipação de gargalos",
          ],
        },
        attentionPhrase:
          "A mudança não está em registrar mais. Está em enxergar melhor, na hora certa, com o recurso certo.",
        heroImage: {
          src: gestaoSlide4Comando,
          alt: "Sala de comando com painéis de filas, ocupação e alertas da rede",
        },
        bullets: [],
      },
    };
  }

  // SLIDE 5 — Os 8 pontos de uma rede coordenada
  if (s.id === "journey") {
    return {
      ...s,
      kind: "narrative",
      accent: "cyan",
      title: "Sustentar escala exige uma base comum de coordenação.",
      subtitle: "Os 8 pontos de uma rede coordenada",
      content: {
        headline: "Base de coordenação",
        cardVisual: "funnel",
        omitSidePhoto: true,
        valueStagesLead:
          "Não se trata de informatizar mais uma etapa. Trata-se de fazer todos os elementos da rede funcionarem com a mesma lógica de execução.\n\nOs 8 pontos de uma rede coordenada:",
        valueStagesFlat: true,
        valueStagesGridCols: 4,
        valueStagesRevealChunkSize: 4,
        allTextWhite: true,
        valueStages: [
          { number: "01", label: "Entrada na rede" },
          { number: "02", label: "Regulação do acesso" },
          { number: "03", label: "Atenção ambulatorial" },
          { number: "04", label: "Encaminhamento entre níveis" },
          { number: "05", label: "Diagnóstico" },
          { number: "06", label: "Organização de equipes" },
          { number: "07", label: "Gestão da capacidade instalada" },
          { number: "08", label: "Governança e decisão" },
        ],
        newsItems: [
          {
            imageUrl: "/intro/revista digital_trilha4_slide5.png",
            articleUrl:
              "https://abcis.org.br/revista-digital-health-brazil-edicao-no-3/",
            source: "ABCIS",
            title: "Revista Digital Health Brazil — Edição nº 3",
            skipEmbedPreview: true,
          },
        ],
        attentionPhrase:
          "Quando esses pontos deixam de operar isoladamente e passam a funcionar como sistema, a rede ganha previsibilidade real.",
        bullets: [],
        journeyStages: [],
      },
    };
  }

  // SLIDE 6 — Ecossistema Salux em capacidades
  if (s.id === "integration") {
    return {
      ...s,
      kind: "capacities",
      accent: "cyan",
      title: "Essa arquitetura já existe na prática.",
      subtitle: "Capacidades centrais de coordenação e de sustentação da rede",
      content: {
        headline: "Essa arquitetura já existe na prática.",
        cardVisual: "scale",
        body: "O Ecossistema Salux organiza capacidades para cada ponto da rede — de forma integrada, não como produtos isolados.",
        capacityGroups: [
          {
            title: "Capacidades centrais de coordenação",
            tone: "core",
            items: [
              {
                name: "Base digital",
                subtitle: "Plataforma Salux + INITIA",
                description:
                  "Dados, fluxos, regulação e decisão em lógica comum.",
                tagline: "Coordenação desde a origem.",
                productImage: "/GESTAO_PUBLICA_6/base_digital.png",
              },
              {
                name: "Regulação e acesso",
                subtitle: "Salux + INITIA · Agentes",
                description:
                  "Priorização por criticidade clínica, contexto e capacidade disponível.",
                tagline: "Acesso organizado por risco, não por fila.",
              },
              {
                name: "Capilaridade",
                subtitle: "CloudHealth",
                description:
                  "Teleatendimento, acompanhamento remoto e cuidado híbrido.",
                tagline: "Alcance sem expansão física linear.",
              },
              {
                name: "Diagnóstico",
                subtitle: "Med.Place",
                description:
                  "Coordena capacidade diagnóstica e conecta exames à jornada.",
                tagline: "Diagnóstico em rede, sem ruptura.",
                productImage: "/GESTAO_PUBLICA_6/diagnostico_integrado.MOV",
              },
            ],
          },
          {
            title: "Capacidades de sustentação da rede",
            tone: "support",
            items: [
              {
                name: "Equipe",
                subtitle: "StarGrid",
                description:
                  "Escala, cobertura e alocação conforme demanda e criticidade.",
                tagline: "Capacidade instalada em movimento.",
                productImage: "/GESTAO_PUBLICA_6/equipe.png",
              },
              {
                name: "Governança documental",
                subtitle: "ZeroDox",
                description:
                  "Rastreabilidade, conformidade e continuidade operacional.",
                tagline: "Sustentar sem fragilidade.",
              },
              {
                name: "Áreas críticas",
                subtitle: "VisionPilot / AGCOM · SkyMed",
                description:
                  "Fluxos, ocupação e sinais operacionais em tempo real.",
                tagline: "A operação acompanhada enquanto acontece.",
                productImage: "/GESTAO_PUBLICA_6/areas_críticas.mp4",
              },
              {
                name: "Controle econômico",
                subtitle: "TI Hospitalar",
                description:
                  "Previsibilidade sobre demanda, produção e uso de recursos.",
                tagline: "Decisão pública com base em dados.",
                productImage: "/GESTAO_PUBLICA_6/governança_documental.mkv",
              },
            ],
          },
        ],
        bullets: [],
      },
    };
  }

  // SLIDE 7 — INITIA · Agentes
  if (s.id === "governance") {
    return {
      ...s,
      kind: "narrative",
      accent: "emerald",
      title: "Com o INITIA, a gestão deixa de correr atrás da informação.",
      subtitle:
        "Agentes que ampliam a capacidade de leitura, priorização e decisão",
      content: {
        headline: "INITIA · Agentes",
        cardVisual: "relay",
        bannerMedia: {
          videoSrc: "/intro/gestao-sem-titulo.mp4",
          posterSrc: gestaoSemTituloPosterUrl,
          playOnClick: true,
        },
        contrastPair: {
          left: {
            label: "Sem INITIA",
            tone: "warm",
            text: "A gestão procura dados.\nConsolida informações em planilhas.\nInterpreta filas manualmente.\nIdentifica gargalos tarde.\nDecide sob pressão.",
          },
          right: {
            label: "Com INITIA",
            tone: "cool",
            text: "A informação se apresenta.\nO contexto da rede acompanha.\nO risco é priorizado.\nO agente orienta.\nA decisão ganha base operacional.",
          },
        },
        body: "O que os Agentes fazem na prática:",
        bullets: [
          "Estruturam dados críticos desde a entrada da rede",
          "Analisam filas e identificam prioridades clínicas",
          "Destacam gargalos em tempo contínuo",
          "Organizam encaminhamentos entre níveis assistenciais",
          "Apoiam decisões regulatórias com base em contexto",
          "Antecipam pontos de tensão antes que virem crise",
        ],
        attentionPhrase:
          "Os agentes não substituem o gestor. Ampliam sua capacidade de leitura, priorização e decisão.",
        closingHighlight:
          "A tecnologia deixa de apenas registrar a pressão — e passa a transformar pressão em decisão e decisão em execução.",
        revealPillars: [],
      },
    };
  }

  // SLIDE 8 — Pontos de entrada → resposta sistêmica
  if (s.id === "roadmap") {
    return {
      ...s,
      kind: "narrative",
      accent: "cyan",
      title: "O ponto de entrada pode variar. A resposta é sempre sistêmica.",
      subtitle: "Use este slide para aprofundar a dor específica do visitante",
      content: {
        headline: "Pontos de entrada",
        cardVisual: "spiral",
        bannerMedia: {
          videoSrc: "/intro/gestao-8.mp4",
          posterSrc: gestao8PosterUrl,
          playOnClick: true,
        },
        valueStagesFlat: true,
        valueStagesGridCols: 3,
        valueStagesRevealChunkSize: 3,
        allTextWhite: true,
        valueStagesClickable: false,
        valueStages: [
          {
            number: "🚦",
            label: "Fila / Regulação",
            description: "→ Salux + INITIA + Agentes",
          },
          {
            number: "📈",
            label: "Leitura da rede",
            description: "→ Salux + INITIA",
          },
          { number: "📡", label: "Capilaridade", description: "→ CloudHealth" },
          { number: "🔬", label: "Diagnóstico", description: "→ Med.Place" },
          {
            number: "👥",
            label: "Equipe / Cobertura",
            description: "→ StarGrid",
          },
          { number: "📄", label: "Documentação", description: "→ ZeroDox" },
          {
            number: "🏥",
            label: "Áreas críticas",
            description: "→ VisionPilot / AGCOM + SkyMed",
          },
          {
            number: "💰",
            label: "Controle econômico",
            description: "→ TI Hospitalar",
          },
        ],
        closingQuestion:
          "Qual desses pontos está gerando mais pressão na sua rede agora?",
        hideContactForm: true,
        bullets: [],
        roadmapTransform: false,
      },
    };
  }

  // SLIDE 10 — Encerramento
  if (s.id === "closing") {
    return {
      ...s,
      accent: "cyan",
      title:
        "Sua rede está sendo coordenada como sistema — ou administrada por partes?",
      subtitle: "Mapear juntos onde a rede mais perde coordenação",
      content: {
        headline:
          "Sua rede está sendo coordenada como sistema — ou administrada por partes?",
        cardVisual: "shield",
        body: "A nova fase da saúde pública não será definida por quem digitalizou mais processos.\nSerá definida por quem conseguir coordenar informação, capacidade instalada, regulação e cuidado em uma lógica única de execução.",
        attentionPhrase:
          "Esse movimento pode começar pelo ponto onde sua rede hoje mais perde coordenação.",

        closingQuestionLabel: "CTA · Pergunta-gatilho",
        closingQuestion:
          "Se a sua rede parasse de apagar incêndio por uma semana, o que você finalmente conseguiria enxergar?",
        closingHighlight:
          "Ecossistema Salux · A base para uma nova forma de operar a saúde pública.",
        bannerPhotoExpandable: false,
        valueStagesFlat: false,
        valueStagesGridCols: 3,
        valueStagesRevealChunkSize: 3,
        valueStagesClickable: false,
        valueStages: [
          { number: "→", label: "Pressão em decisão." },
          { number: "→", label: "Decisão em execução." },
          { number: "→", label: "Execução em acesso e cuidado." },
        ],
        highlightPhrases: [],
        bullets: [],
      },
    };
  }

  return s;
});

/** Card extra 9 — resultado/benefícios. Inserido antes do closing. */
const gestaoResultsStep: PresentationStep = {
  id: "gestao-results",
  index: 8,
  title:
    "O valor não está em reduzir filas. Está em impedir que a rede acumule passivos.",
  subtitle: "Resultado: coordenação sustentável da rede",
  position: { x: 1320, y: 3320 },
  scale: 1.2,
  kind: "narrative",
  accent: "emerald",
  content: {
    headline: "Resultado",
    cardVisual: "bridge",
    heroImage: {
      src: gestaoSlide9ResultadoUrl,
      alt: "Rede desorganizada transformada em operação coordenada com hospital no centro",
    },
    bannerUnframed: true,
    bannerHeightClass: "h-[300px]",
    hideFloatingWatermarkSvg: true,
    valueStagesLead:
      "Com uma base coordenada, a rede deixa de depender apenas de esforço contínuo de compensação.",
    valueStagesFlat: true,
    valueStagesGridCols: 3,
    valueStagesRevealChunkSize: 3,
    allTextWhite: true,
    valueStages: [
      { number: "✓", label: "Mais previsibilidade sobre demanda e capacidade" },
      { number: "✓", label: "Mais priorização baseada em risco clínico real" },
      { number: "✓", label: "Mais fluidez entre níveis assistenciais" },
      { number: "✓", label: "Menos dependência de controles paralelos" },
      { number: "✓", label: "Mais governança sobre filas e gargalos" },
      {
        number: "✓",
        label: "Mais capacidade de decisão pública com base em dados",
      },
    ],
    attentionPhrase:
      "Eficiência no setor público não é apenas economia. É capacidade de transformar recurso disponível em acesso, cuidado e execução.",
  },
};

/** Sequência final — insere `gestao-results` (card 9) antes do closing. */
export const gestaoSteps: PresentationStep[] = (() => {
  const closingIdx = gestaoBaseSteps.findIndex((s) => s.id === "closing");
  if (closingIdx < 0) return gestaoBaseSteps;
  const before = gestaoBaseSteps.slice(0, closingIdx);
  const closing = gestaoBaseSteps[closingIdx];
  return [...before, gestaoResultsStep, closing].map((s, i) => ({
    ...s,
    index: i,
  }));
})();
