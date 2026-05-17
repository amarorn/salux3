import type { PresentationStep } from "./types";
import { steps as baseSteps } from "./presentation";

import news1Url from "@/assets/presentation/news-1.png?url";
import news2Url from "@/assets/presentation/news-2.png?url";

export const presentationReceitaMeta = {
  title: "Proteção econômica da operação em saúde",
  subtitle: "Valor, continuidade e receita na operação",
  author: "",
};

function cloneSteps(steps: PresentationStep[]): PresentationStep[] {
  return steps.map((s) => ({
    ...s,
    content: { ...s.content },
  }));
}

/** Trilha Receita: 9 slides — diagnóstico econômico, jornada e ecossistema Salux. */
const baseMapped: PresentationStep[] = cloneSteps(baseSteps).map(
  (s): PresentationStep => {
    // SLIDE 1 — Capa
    if (s.id === "cover") {
      return {
        ...s,
        title: "Onde a operação de saúde perde valor hoje?",
        subtitle: "Receita",
        content: {
          headline: "Abertura",
          cardVisual: "reveal",
          bannerMedia: {
            videoSrc: "/intro/predicao-glosa-ciclo-receita-3.mp4",
            playOnClick: false,
          },
          contrastPair: {
            left: {
              label: "Visível",
              icon: "👁",
              tone: "warm",
              text: "Glosa identificada.\nConta devolvida.\nRetrabalho registrado.",
            },
            right: {
              label: "Despercebido",
              icon: "🌫",
              tone: "cool",
              text: "Valor que não se converte.\nPerda que não aparece como erro.\nPadrão que se repete.",
            },
          },
          body: "Existe uma perda que acontece todos os dias na operação — e que nem sempre aparece como problema.",
          attentionPhrase:
            "A maior parte do valor perdido não está no erro óbvio.\nEstá na ruptura silenciosa entre cuidado e receita.",
          closingQuestionLabel: "CTA · Pergunta-gatilho",
          closingQuestion:
            "Onde a sua operação está perdendo valor hoje — no que é visível ou no que passa despercebido?",
        },
      };
    }

    // SLIDE 2 — Diagnóstico: padrão, não desvio
    if (s.id === "limit") {
      return {
        ...s,
        title: "Não é um desvio pontual. É um padrão.",
        subtitle: "A perda se forma dentro da operação, todos os dias",
        content: {
          headline: "Diagnóstico",
          omitSidePhoto: true,
          cardVisual: "pattern",
          allTextWhite: true,
          metrics: [
            {
              value: 14.6,
              decimals: 1,
              label: "Glosa média do setor",
              suffix:
                "Taxa média de glosa no setor hospitalar brasileiro — valor que sai da conta antes mesmo de ser contestado.",
              ring: 14.6,
              trend: [11.8, 12.4, 12.1, 12.9, 13.5, 13.8, 14.2, 14.6],
              delta: 0.8,
              deltaUnit: "pp",
            },
            {
              value: 50,
              decimals: 0,
              label: "Tempo administrativo",
              suffix:
                "Do tempo das equipes consumido por tarefas administrativas — tempo que deveria gerar receita, não gerir inconsistência.",
              ring: 50,
              trend: [38, 41, 43, 44, 46, 47, 48, 50],
              delta: 2,
              deltaUnit: "pp",
            },
          ],
          body: "Esses números não indicam má gestão. Indicam um modelo operacional que foi construído para reagir — e não para prevenir.",
          attentionPhrase:
            "Não se trata apenas de ineficiência. É valor que deixa de se converter ao longo da operação.",
          newsUrls: [news1Url, news2Url],
        },
      };
    }

    // SLIDE 3 — A perda se acumula em 4 etapas
    if (s.id === "why-agents") {
      return {
        ...s,
        kind: "narrative",
        accent: "rose",
        title: "A perda não acontece em um único ponto. Ela se acumula.",
        subtitle: "Quatro etapas críticas da conversão do cuidado em receita",
        content: {
          headline: "Acúmulo",
          cardVisual: "accumulation",
          allTextWhite: true,
          valueStagesClickable: false,
          valueStagesLead:
            "Ao longo da jornada assistencial, a conversão do cuidado em receita passa por quatro etapas críticas:",
          valueStagesFlat: true,
          valueStagesGridCols: 4,
          valueStages: [
            {
              number: "01",
              label: "Registro",
              description: "Dado incompleto ou inconsistente na origem.",
            },
            {
              number: "02",
              label: "Validação",
              description: "Inconsistência que passa sem checagem.",
            },
            {
              number: "03",
              label: "Execução",
              description: "Procedimento realizado sem registro adequado.",
            },
            {
              number: "04",
              label: "Consolidação",
              description:
                "Conta que chega ao faturamento com lacunas acumuladas.",
            },
          ],
          body: "Cada etapa parece administrável isoladamente. Mas as rupturas se acumulam — e o resultado aparece apenas no fim, quando o valor já se perdeu.",
          attentionPhrase:
            "São pequenas rupturas que se acumulam e interrompem a conversão do cuidado em receita.",
        },
      };
    }

    // SLIDE 4 — O modelo atual reage ao erro
    if (s.id === "architecture") {
      return {
        ...s,
        kind: "narrative",
        accent: "rose",
        title: "O modelo atual reage ao erro. O valor já se foi.",
        subtitle: "O custo de corrigir é sempre maior que o custo de prevenir",
        content: {
          headline: "Modelo reativo",
          cardVisual: "late-reaction",
          valueStagesFlat: true,
          valueStagesClickable: false,
          valueStages: [
            {
              number: "✕",
              label: "Corrige no final",
              description: "Quando o valor já se perdeu na jornada.",
            },
            {
              number: "✕",
              label: "Audita depois",
              description: "Quando a inconsistência já gerou glosa.",
            },
            {
              number: "✕",
              label: "Registra",
              description: "Mas não conduz. O dado existe — a ação não vem.",
            },
          ],
          body: "No curto prazo, a equipe compensa. Corrige, reconcilia, recorre. Mas esse esforço custa tempo, custa gente, custa margem.",
          attentionPhrase:
            "Grande parte do esforço acontece tarde demais. O custo de corrigir é sempre maior que o custo de prevenir.",
          closingQuestionLabel: "CTA · Pergunta-gatilho",
          closingQuestion:
            "Quanto da receita da sua operação é resultado de correção — e quanto vem de fluxo estruturado?",
          hideContactForm: true,
        },
      };
    }

    // SLIDE 5 — A virada de lógica (de reação para estrutura)
    if (s.id === "journey") {
      return {
        ...s,
        kind: "narrative",
        accent: "emerald",
        title: "A questão não é corrigir melhor. É estruturar para não perder.",
        subtitle: "Da recuperação no final à proteção ao longo da jornada",
        content: {
          headline: "Virada de lógica",
          cardVisual: "transform",
          heroImage: {
            src: "/intro/trilha1_slide5.png",
            alt: "Comparação sem agentes versus com agentes na proteção da receita",
            transparentCutout: true,
          },
          bannerUnframed: true,
          hideFloatingWatermarkSvg: true,
          bannerHeightClass: "h-[320px]",
          contrastPair: {
            left: {
              label: "Antes",
              tone: "warm",
              text: "A receita é recuperada no final — após glosa, recurso e retrabalho.",
            },
            right: {
              label: "Depois",
              tone: "cool",
              text: "A receita é construída ao longo da jornada — protegida enquanto acontece.",
            },
          },
          body: "Essa virada exige uma mudança na forma como a operação é estruturada:",
          beforeAfter: {
            before: [
              "Reação ao erro",
              "Auditoria posterior",
              "Registro sem condução",
            ],
            after: [
              "Prevenção na origem",
              "Controle contínuo",
              "Dado que orienta ação",
            ],
          },
          attentionPhrase:
            "O valor precisa ser protegido enquanto acontece — não recuperado depois que se perdeu.",
        },
      };
    }

    // SLIDE 6 — 6 pontos coordenados
    if (s.id === "integration") {
      return {
        ...s,
        kind: "narrative",
        accent: "cyan",
        title: "Isso não se resolve com uma solução isolada.",
        subtitle: "Os 6 pontos que precisam funcionar como base coordenada",
        content: {
          headline: "Base coordenada",
          cardVisual: "mesh",
          heroImage: {
            src: "/intro/trilha1_slide6.svg",
            alt: "Seis pontos coordenados da proteção da receita",
          },
          bannerUnframed: true,
          hideFloatingWatermarkSvg: true,
          bannerHeightClass: "h-[300px]",
          valueStagesLead:
            "A proteção da receita depende de como a operação funciona como um todo — da origem ao faturamento.\n\nOs 6 pontos que precisam funcionar como base coordenada:",
          valueStagesFlat: true,
          valueStagesGridCols: 3,
          valueStagesClickable: false,
          valueStages: [
            {
              number: "01",
              label: "Base operacional",
              description: "Origem estruturada da informação.",
            },
            {
              number: "02",
              label: "Ciclo de receita",
              description: "Acompanhamento contínuo da jornada.",
            },
            {
              number: "03",
              label: "Governança documental",
              description: "Documentação que sustenta valor.",
            },
            {
              number: "04",
              label: "Força de trabalho",
              description: "Escala, alocação e produtividade.",
            },
            {
              number: "05",
              label: "Centro cirúrgico",
              description: "Alta complexidade sob controle.",
            },
            {
              number: "06",
              label: "Inteligência em tempo real",
              description: "Operação lida enquanto acontece.",
            },
          ],
          attentionPhrase:
            "Esses elementos não operam de forma independente. Quando um falha, a perda se forma nos outros.",
        },
      };
    }

    // SLIDE 7 — Ecossistema Salux em capacidades centrais e de sustentação
    if (s.id === "governance") {
      return {
        ...s,
        kind: "capacities",
        accent: "cyan",
        title: "Ecossistema Salux",
        subtitle: "Capacidades centrais e de sustentação da receita",
        content: {
          headline: "Essa arquitetura já existe na prática.",
          cardVisual: "orbit",
          body: "O Ecossistema Salux estrutura cada ponto da operação de receita — de forma integrada, não como soluções isoladas.",
          capacityGroups: [
            {
              title: "Capacidades centrais da receita",
              tone: "core",
              items: [
                {
                  name: "Base operacional",
                  description:
                    "Base estruturada que reduz retrabalho na origem.",
                  tagline: "A consistência da operação começa aqui.",
                  productImage: "/intro/receita-cap/base-operacional.png",
                },
                {
                  name: "Ciclo de receita",
                  description:
                    "Acompanhamento do fluxo que reduz perda ao longo da jornada.",
                  tagline: "A glosa deixa de ser descoberta no final.",
                  productImage: "/intro/gestao-sem-titulo.mp4",
                },
                {
                  name: "Governança documental",
                  description:
                    "Documentação estruturada que sustenta receita e reduz glosa.",
                  tagline:
                    "O valor deixa de ser questionado e passa a ser comprovado.",
                  productImage: "/intro/receita-cap/governanca-documental.mp4",
                },
              ],
            },
            {
              title: "Capacidades de sustentação da receita",
              tone: "support",
              items: [
                {
                  name: "Força de trabalho",
                  description: "Reduz custo invisível e aumenta produtividade.",
                  tagline: "Escala e alocação deixam de ser ruído.",
                  productImage: "/intro/receita-cap/forca-trabalho.png",
                },
                {
                  name: "Centro cirúrgico",
                  description:
                    "Registro anestésico estruturado e leitura da operação em tempo real.",
                  tagline: "Alta complexidade exige controle constante.",
                  productImage: "/intro/receita-cap/centro-cirurgico.mp4",
                },
                {
                  name: "Inteligência em tempo real",
                  description: "A operação deixa de ser analisada depois.",
                  tagline: "Passa a ser acompanhada enquanto acontece.",
                  productImage: "/intro/receita-cap/inteligencia-tempo-real.png",
                },
              ],
            },
          ],
        },
      };
    }

    // SLIDE 8 — A tecnologia deixa de registrar e passa a atuar
    if (s.id === "roadmap") {
      return {
        ...s,
        kind: "narrative",
        accent: "emerald",
        title: "A tecnologia deixa de registrar e passa a atuar.",
        subtitle:
          "Sem agentes × Com agentes (Maria) — antecipação em vez de retrabalho",
        content: {
          headline: "Agentes",
          cardVisual: "radar",
          heroImage: {
            src: "/intro/trilha1_slide8.png",
            alt: "Comparação sem agentes versus com agentes Maria na operação",
            transparentCutout: true,
          },
          bannerUnframed: true,
          hideFloatingWatermarkSvg: true,
          bannerHeightClass: "h-[320px]",
          contrastPair: {
            left: {
              label: "Sem agentes",
              tone: "warm",
              text: "A operação registra. A equipe interpreta. A inconsistência é descoberta no final. O retrabalho começa.",
            },
            right: {
              label: "Com agentes (Maria)",
              tone: "cool",
              text: "O agente identifica, prioriza e aciona. O risco é antecipado antes da perda. A operação ganha capacidade de resposta em tempo real.",
            },
          },
          body: "O que os agentes fazem na proteção da receita:",
          bullets: [
            "Identificam inconsistências no registro antes do faturamento",
            "Priorizam pendências com maior risco de glosa",
            "Sinalizam rupturas no fluxo assistencial com impacto financeiro",
            "Acompanham o ciclo de receita em tempo contínuo",
            "Antecipam pontos de perda antes que se materializem",
          ],
          attentionPhrase:
            "A antecipação de risco reduz perda antes que aconteça. A operação para de correr atrás.",
        },
      };
    }

    // SLIDE 9 — Encerramento: a perda deixa de ser invisível
    if (s.id === "closing") {
      return {
        ...s,
        accent: "emerald",
        title: "A perda deixa de ser invisível.",
        subtitle:
          "Com base coordenada, a receita passa a ser protegida ao longo da jornada",
        content: {
          headline: "A perda deixa de ser invisível.",
          cardVisual: "flow",
          body: "Com uma base operacional coordenada, a receita deixa de ser recuperada no final e passa a ser protegida ao longo da jornada.",

          valueStagesFlat: true,
          valueStagesGridCols: 3,
          valueStages: [
            {
              number: "✓",
              label: "Mais previsibilidade sobre receita e margem",
              description: "",
            },
            {
              number: "✓",
              label: "Menos retrabalho de faturamento e reconciliação",
              description: "",
            },
            {
              number: "✓",
              label: "Mais controle sobre glosa antes do faturamento",
              description: "",
            },
            {
              number: "✓",
              label: "Menos valor perdido em rupturas silenciosas",
              description: "",
            },
            {
              number: "✓",
              label: "Mais capacidade de antecipar risco operacional",
              description: "",
            },
            {
              number: "✓",
              label: "Operação que protege valor enquanto acontece",
              description: "",
            },
          ],
          attentionPhrase:
            "A diferença não está em ter tecnologia. Está na capacidade de operar com ela.",
          closingQuestion:
            "Se você soubesse exatamente onde a receita está vazando agora, o que mudaria na sua operação amanhã?",
          closingHighlight:
            "Ecossistema Salux · A base para uma nova forma de operar a saúde.",
          closingLogoFlight: true,
        },
      };
    }

    return s;
  },
);

export const receitaSteps: PresentationStep[] = baseMapped.map((s, i) => ({
  ...s,
  index: i,
  content: { ...s.content, allTextWhite: true },
}));
