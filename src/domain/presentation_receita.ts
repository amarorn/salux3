import type { PresentationStep, RoadmapAgentCard } from './types';
import { steps as baseSteps } from './presentation';

const receitaRoadmapAgents: RoadmapAgentCard[] = [
  {
    title: 'BASE OPERACIONAL',
    segments: [
      {
        type: 'text',
        text:
          'Base estruturada na origem\nreduz retrabalho ao longo da operação.',
      },
      { type: 'product', name: 'Plataforma Salux' },
    ],
  },
  {
    title: 'CICLO DE RECEITA',
    segments: [
      {
        type: 'text',
        text:
          'Fluxo de receita acompanhado em tempo real\nreduz perda ao longo da jornada.',
      },
      { type: 'product', name: 'Plataforma Salux' },
    ],
  },
  {
    title: 'GOVERNANÇA DOCUMENTAL',
    segments: [
      {
        type: 'text',
        text:
          'Documentação estruturada\nsustenta receita e reduz glosa.\nO valor deixa de ser questionado\ne passa a ser comprovado.',
      },
      { type: 'product', name: 'ZeroDox' },
    ],
  },
  {
    title: 'FORÇA DE TRABALHO COMO CAPACIDADE',
    segments: [
      {
        type: 'text',
        text:
          'Escala, alocação e produtividade\ndeixam de ser ruído\ne passam a ser controláveis.',
      },
      { type: 'product', name: 'StarGrid' },
    ],
  },
  {
    title: 'CENTRO CIRÚRGICO SOB CONTROLE CONTÍNUO',
    segments: [
      {
        type: 'text',
        text:
          'Alta complexidade exige controle constante.\nRegistro anestésico estruturado\nreduz risco clínico e financeiro.',
      },
      { type: 'product', name: 'SkyMed' },
      { type: 'text', text: 'Leitura da operação em tempo real' },
      { type: 'product', name: 'VisionPilot' },
    ],
  },
  {
    title: 'INTELIGÊNCIA EM TEMPO REAL',
    segments: [
      {
        type: 'text',
        text:
          'A operação deixa de ser analisada depois\ne passa a ser acompanhada enquanto acontece.',
      },
      { type: 'product', name: 'AGCOM / VisionPilot' },
    ],
  },
];

export const presentationReceitaMeta = {
  title: 'Proteção econômica da operação em saúde',
  subtitle: 'Valor, continuidade e receita na operação',
  author: '',
};

function cloneSteps(steps: PresentationStep[]): PresentationStep[] {
  return steps.map((s) => ({
    ...s,
    content: { ...s.content },
  }));
}

/**
 * Slide extra (entre `roadmap` e `closing`) — "A tecnologia que age".
 * Marca a virada: identificar → priorizar → agir.
 */
const tecnologiaQueAgeStep: PresentationStep = {
  id: 'tecnologia-que-age',
  index: 8,
  title: 'A tecnologia que age',
  subtitle: 'Identificar · Priorizar · Agir',
  position: { x: 560, y: -1480 },
  scale: 1.25,
  kind: 'highlight',
  accent: 'cyan',
  content: {
    headline: 'Da leitura passiva à ação contínua',
    body:
      'Identificar onde o valor está se perdendo.\nPriorizar o que sustenta a receita ao longo da jornada.\nAgir antes que a perda se materialize.',
    attentionPhrase: 'A perda deixa de ser invisível. Passa a ser evitável.',
  },
};

/** Trilha Receita: 10 slides — diagnóstico econômico, jornada e ecossistema Salux. */
const baseMapped: PresentationStep[] = cloneSteps(baseSteps).map((s): PresentationStep => {
  // SLIDE 1 — Capa
  if (s.id === 'cover') {
    return {
      ...s,
      title: 'Qual o percentual de glosa do seu hospital hoje?',
      subtitle: 'Receita',
      content: {
        headline: 'Abertura',
        body:
          'A maioria dos gestores não sabe responder.\n\nO número está em algum lugar do relatório.\nMas o que ele esconde, na operação, raramente é visível.',
        meta: {
          Edição: '01 / 2026',
          Tempo: '~12 min',
          Público: 'Liderança executiva e financeira',
        },
      },
    };
  }

  // SLIDE 2 — Diagnóstico com 3 KPIs
  if (s.id === 'limit') {
    return {
      ...s,
      title: 'A perda não começa no faturamento',
      subtitle: 'Ela se forma dentro da operação, todos os dias',
      content: {
        headline: 'Diagnóstico',
        metrics: [
          {
            value: 14.6,
            decimals: 1,
            label: 'Glosa média do setor',
            suffix: 'da receita não se converte ao longo da operação',
            ring: 14.6,
            trend: [11.8, 12.4, 12.1, 12.9, 13.5, 13.8, 14.2, 14.6],
            delta: 0.8,
            deltaUnit: 'pp',
          },
          {
            value: 50,
            decimals: 0,
            label: 'Tempo administrativo',
            suffix: 'do tempo do time perdido em tarefas administrativas',
            ring: 50,
            trend: [38, 41, 43, 44, 46, 47, 48, 50],
            delta: 2,
            deltaUnit: 'pp',
          },
          {
            value: 30,
            decimals: 0,
            label: 'Desperdício',
            suffix: 'dos recursos em saúde são considerados desperdício',
            ring: 30,
            trend: [22, 24, 25, 26, 27, 28, 29, 30],
            delta: 1,
            deltaUnit: 'pp',
          },
        ],
        body:
          'Isso não é um desvio pontual. É um padrão.\nÉ valor que deixa de se converter ao longo da operação.',
      },
    };
  }

  // SLIDE 3 — Reframe: glosa é consequência
  if (s.id === 'why-agents') {
    return {
      ...s,
      kind: 'highlight',
      title: 'Glosa não é causa. É consequência.',
      subtitle: 'A causa está na jornada do paciente',
      content: {
        headline: 'Reframe',
        body:
          'Glosa não é causa.\nÉ consequência.\n\nA causa está na jornada do paciente — onde o valor se forma ou se perde.',
        attentionPhrase: 'A glosa é o sintoma. A jornada é a fonte.',
      },
    };
  }

  // SLIDE 4 — Onde a perda se forma (4 etapas)
  if (s.id === 'architecture') {
    return {
      ...s,
      kind: 'narrative',
      title: 'Onde a perda se forma',
      subtitle: 'Pontos críticos da jornada de valor',
      content: {
        headline: 'Jornada do valor',
        bullets: [
          'Admissão — captura inicial do contexto',
          'Suprimentos — consumo e rastreabilidade',
          'Prontuário — registro clínico que sustenta cobrança',
          'Faturamento — momento da conversão em receita',
        ],
        body:
          'Quando a informação se quebra entre essas etapas, o valor se perde.\nNão é falha de área. É falha de continuidade.',
        painPointsLayout: true,
      },
    };
  }

  // SLIDE 5 — Limite do modelo atual
  if (s.id === 'journey') {
    return {
      ...s,
      kind: 'narrative',
      title: 'O modelo atual reage ao erro',
      subtitle: 'Auditar depois é tarde demais',
      content: {
        headline: 'Limite do modelo atual',
        bullets: [
          'Audita depois — quando a inconsistência já aconteceu',
          'Corrige no fim — quando o valor já se perdeu',
          'Registra, mas não conduz — falta loop de ação',
          'Grande parte do esforço acontece tarde demais',
        ],
        body:
          'Cada esforço de correção custa mais e recupera menos.\nA conta final cresce porque a operação não interrompe a perda no ponto onde ela se forma.',
      },
    };
  }

  // SLIDE 6 — Virada de lógica
  if (s.id === 'integration') {
    return {
      ...s,
      kind: 'highlight',
      title: 'A receita deixa de ser recuperada no final',
      subtitle: 'Passa a ser construída ao longo da jornada',
      content: {
        headline: 'Virada de lógica',
        body:
          'A receita deixa de ser recuperada no final.\nPassa a ser construída ao longo da jornada.\n\nProteger valor enquanto acontece.',
        attentionPhrase: 'Proteger valor enquanto acontece.',
      },
    };
  }

  // SLIDE 7 — Arquitetura coordenada (6 pilares com reveal)
  if (s.id === 'governance') {
    return {
      ...s,
      title: 'Arquitetura coordenada',
      subtitle: 'Seis pilares operando como base unificada',
      content: {
        headline: 'Arquitetura',
        revealPillars: [
          'Base operacional',
          'Ciclo de receita',
          'Governança documental',
          'Força de trabalho',
          'Centro cirúrgico',
          'Inteligência em tempo real',
        ],
        body:
          'Esses elementos não operam de forma independente.\nEles precisam funcionar como uma base coordenada.',
      },
    };
  }

  // SLIDE 8 — Capacidades que sustentam a receita
  if (s.id === 'roadmap') {
    return {
      ...s,
      title: 'Capacidades que sustentam a receita',
      subtitle: 'Da base operacional à inteligência em tempo real',
      content: {
        headline: 'Capacidades',
        roadmapAgents: receitaRoadmapAgents,
      },
    };
  }

  // SLIDE 10 — Encerramento
  if (s.id === 'closing') {
    return {
      ...s,
      title: 'A diferença não está em ter tecnologia',
      subtitle: 'Está em operar com ela',
      content: {
        headline: 'Encerramento',
        body:
          'A diferença não está em ter tecnologia.\nEstá em operar com ela.\n\nComece pelo ponto mais crítico da sua operação.',
        attentionPhrase: 'Ecossistema Salux.',
      },
    };
  }

  return s;
});

// Insere o novo slide (slide 9) imediatamente antes do `closing`
export const receitaSteps: PresentationStep[] = (() => {
  const closingIdx = baseMapped.findIndex((s) => s.id === 'closing');
  const before = baseMapped.slice(0, closingIdx);
  const closing = baseMapped.slice(closingIdx);
  return [...before, tecnologiaQueAgeStep, ...closing].map((s, i) => ({
    ...s,
    index: i,
  }));
})();
