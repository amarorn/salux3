import type { PresentationStep } from './types';
import { steps as baseSteps } from './presentation';

import governancaTrilha5NoticiaIa from '@/assets/presentation/governanca-trilha5-noticia-ia.png?url';
import governancaTrilha5AiTech from '@/assets/presentation/governanca-trilha5-ai-tech.png?url';
import governancaTrilha5TransformacaoOps from '@/assets/presentation/governanca-trilha5-transformacao-ops.png?url';
import governancaWhyAgentsBannerUrl from '@/assets/presentation/governanca-why-agents-banner.png?url';

export const presentationGovernancaMeta = {
  title: 'IA agêntica',
  subtitle: 'A resposta arquitetural ao limite da digitalização em saúde',
  author: '',
};

function cloneSteps(steps: PresentationStep[]): PresentationStep[] {
  return steps.map((s) => ({
    ...s,
    content: { ...s.content },
  }));
}

/** Trilha IA Agêntica — 5 cards iniciais. */
export const governancaSteps: PresentationStep[] = cloneSteps(baseSteps).map((s) => {
  // SLIDE 1 — Abertura da trilha
  if (s.id === 'cover') {
    return {
      ...s,
      kind: 'narrative',
      accent: 'cyan',
      title: 'Era agêntica: a resposta ao limite da digitalização em saúde.',
      subtitle: 'Slide 01 · Abertura da trilha',
      content: {
        headline: 'Abertura da trilha',
        cardVisual: 'strata',
        lead: 'A saúde já tem sistemas. Já tem dados. Já tem automações.',
        heroImage: {
          src: governancaTrilha5NoticiaIa,
          alt: 'Uso de IA na saúde — evidência (Agência Brasil)',
        },
        valueStagesRoad: true,
        valueStagesFlat: true,
        valueStagesGridCols: 4,
        valueStages: [
          { number: '✓', label: 'Sistemas', mediaUrl: governancaTrilha5AiTech },
          { number: '✓', label: 'Dados', mediaUrl: governancaTrilha5AiTech },
          {
            number: '✓',
            label: 'Automações',
            mediaUrl: governancaTrilha5NoticiaIa,
          },
          {
            number: '✕',
            label: 'Coordenação',
            mediaUrl: governancaTrilha5TransformacaoOps,
          },
        ],
        attentionPhrase:
          'Depois de digitalizar processos, o próximo desafio é transformar dados, contexto e inteligência em ação coordenada.',
      },
    };
  }

  // SLIDE 2 — A digitalização criou a base
  if (s.id === 'limit') {
    return {
      ...s,
      kind: 'narrative',
      accent: 'violet',
      title: 'A digitalização criou a base. Mas não completou a transformação.',
      subtitle: 'A linha evolutiva da saúde digital',
      content: {
        headline: 'Digitalização',
        cardVisual: 'evolution',
        heroImage: {
          src: governancaTrilha5AiTech,
          alt: 'IA, dados e interação humano–máquina na operação em saúde',
        },
        lead:
          'Prontuários eletrônicos, sistemas de gestão, módulos especializados, integrações e automações organizaram a informação e reduziram dependências manuais.\n\nEsse ciclo resolveu principalmente o registro, a documentação e a disponibilidade dos dados.',
        leadByParagraph: true,
        valueStagesLead: 'A linha evolutiva da saúde digital:',
        valueStagesFlat: true,
        valueStagesGridCols: 5,
        /** Blocos de cor: 2 × ciano, 2 × âmbar, 1 × roxo (Era agêntica). */
        valueStages: [
          {
            number: '01',
            label: 'Registro manual',
            accent: 'cyan',
            mediaUrl: governancaTrilha5AiTech,
          },
          {
            number: '02',
            label: 'Sistemas',
            accent: 'cyan',
            mediaUrl: governancaTrilha5AiTech,
          },
          {
            number: '03',
            label: 'Integrações',
            accent: 'amber',
            mediaUrl: governancaTrilha5NoticiaIa,
          },
          {
            number: '04',
            label: 'Automações',
            accent: 'amber',
            mediaUrl: governancaTrilha5TransformacaoOps,
          },
          {
            number: '05 →',
            label: 'Era agêntica',
            accent: 'violet',
            mediaUrl: governancaTrilha5AiTech,
          },
        ],
        attentionPhrase:
          'Digitalizar foi necessário. Mas digitalizar não é o mesmo que coordenar.',
        metrics: [],
      },
    };
  }

  // SLIDE 3 — Operação digital ≠ coordenada
  if (s.id === 'why-agents') {
    return {
      ...s,
      kind: 'narrative',
      accent: 'rose',
      title:
        'Uma operação mais digital não é, necessariamente, uma operação mais coordenada.',
      subtitle: 'O problema deixou de ser tecnológico — passou a ser arquitetural',
      content: {
        headline: 'Limite tecnológico',
        cardVisual: 'scatter',
        heroImage: {
          src: governancaWhyAgentsBannerUrl,
          alt:
            'Ilustração de saúde digital: telemóvel com ícone clínico e estetoscópio azul sobre fundo escuro',
          lightenBlackMatte: true,
        },
        bannerUnframed: true,
        hideFloatingWatermarkSvg: true,
        lead: 'Mesmo com mais sistemas, dados e automações, instituições ainda convivem com:',
        valueStagesFlat: true,
        valueStagesGridCols: 4,
        valueStagesRevealChunkSize: 4,
        valueStages: [
          { number: '⚠', label: 'Perdas de receita' },
          { number: '⚠', label: 'Retrabalho' },
          { number: '⚠', label: 'Rupturas assistenciais' },
          { number: '⚠', label: 'Gargalos operacionais' },
          { number: '⚠', label: 'Baixa previsibilidade' },
          { number: '⚠', label: 'Decisões tardias' },
          { number: '⚠', label: 'Jornadas fragmentadas' },
        ],
        evidenceMetrics: [
          {
            style: 'bar',
            badge: 'Dado · Evidência',
            value: 1,
            unit: '',
            prefix: 'Prioridade',
            headline:
              'Eficiência operacional e produtividade estão entre as principais prioridades dos executivos de saúde. (Deloitte)',
            context:
              'O futuro da saúde será impulsionado por dados interoperáveis, plataformas abertas e seguras, e mudança para modelos orientados a melhores desfechos — não apenas mais sistemas.',
          },
        ],
        attentionPhrase:
          'O problema deixou de ser apenas tecnológico. Passou a ser arquitetural.',
        bullets: [],
      },
    };
  }

  // SLIDE 4 — O verdadeiro ponto de perda
  if (s.id === 'architecture') {
    return {
      ...s,
      kind: 'narrative',
      accent: 'amber',
      title: 'O maior desperdício está no intervalo entre dado, decisão e ação.',
      subtitle: 'Slide 04 · O verdadeiro ponto de perda',
      content: {
        headline: 'Intervalo',
        cardVisual: 'gap',
        valueStagesFlat: true,
        valueStagesGridCols: 4,
        valueStagesRevealChunkSize: 4,
        valueStages: [
          { number: '○', label: 'O dado existe', description: 'Mas não chega no tempo certo.' },
          { number: '○', label: 'O alerta existe', description: 'Mas não prioriza.' },
          { number: '○', label: 'O registro existe', description: 'Mas não aciona.' },
          { number: '○', label: 'O indicador existe', description: 'Mas aparece depois do impacto.' },
        ],
        body: 'Onde a perda se materializa:',
        bullets: [
          'A glosa se forma antes do faturamento.',
          'O risco assistencial cresce antes do evento crítico.',
          'O gargalo operacional se acumula antes da crise.',
          'O paciente se perde antes da reinternação.',
          'A fila cresce antes da priorização adequada.',
        ],
        attentionPhrase:
          'A perda não está na ausência de informação. Está no intervalo entre informação e ação.',
      },
    };
  }

  // SLIDE 5 — Adicionar IA a operação fragmentada
  if (s.id === 'journey') {
    return {
      ...s,
      kind: 'narrative',
      accent: 'rose',
      title: 'Adicionar IA a uma operação fragmentada não resolve a fragmentação.',
      subtitle: 'Automatizar processo ruim apenas escala a ineficiência',
      content: {
        headline: 'Limite da IA isolada',
        cardVisual: 'shatter',
        attentionPhrase:
          'Automatizar um processo ruim não cria eficiência. Apenas escala a ineficiência.',
        body: 'Quatro condições que tornam a IA ineficaz:',
        valueStagesFlat: true,
        valueStagesGridCols: 2,
        valueStagesRevealChunkSize: 2,
        valueStages: [
          { number: '✕', label: 'Dados isolados', description: 'A IA não enxerga o todo.' },
          { number: '✕', label: 'Processos mal desenhados', description: 'A automação acelera o erro.' },
          { number: '✕', label: 'Sem governança', description: 'Agentes viram risco.' },
          { number: '✕', label: 'Sem contexto', description: 'A inteligência vira recurso pontual.' },
        ],
        evidenceMetrics: [
          {
            style: 'bar',
            badge: 'Dado · Evidência · HIMSS 2026',
            value: 2026,
            unit: '',
            prefix: '',
            headline:
              'IA agêntica em saúde exige integração, acesso a dados, governança e confiabilidade.',
            context:
              'A discussão global reforça a importância de auditoria das ações e modelos human-in-the-loop para determinados fluxos. Era agêntica não é hype — é arquitetura, governança e execução.',
          },
        ],
        closingHighlight: 'A questão não é ter IA. É ter uma operação preparada para gerar valor com IA.',
        bullets: [],
        journeyStages: [],
      },
    };
  }

  // SLIDE 6 — Era agêntica: inteligência que coordena
  if (s.id === 'integration') {
    return {
      ...s,
      kind: 'narrative',
      accent: 'violet',
      title:
        'A era agêntica começa quando a inteligência deixa de ser pontual e passa a coordenar a operação.',
      subtitle: 'Agentes como camada operacional distribuída',
      content: {
        headline: 'Camada operacional',
        cardVisual: 'rhizome',
        lead:
          'Agentes não são assistentes, chatbots ou automações isoladas. São uma camada operacional distribuída, capaz de:',
        valueStagesFlat: true,
        valueStagesGridCols: 3,
        valueStagesRevealChunkSize: 3,
        valueStages: [
          { number: '→', label: 'Interpretar contexto' },
          { number: '→', label: 'Identificar riscos' },
          { number: '→', label: 'Priorizar ações' },
          { number: '→', label: 'Recomendar caminhos' },
          { number: '→', label: 'Acionar fluxos sob governança' },
          { number: '→', label: 'Sustentar continuidade entre etapas' },
        ],
        body: 'A camada agêntica conecta os fluxos da operação:',
        bullets: [
          'Assistência',
          'Receita',
          'Diagnóstico',
          'Documentação',
          'Equipes',
          'Pós-alta',
          'Gestão',
        ],
        attentionPhrase:
          'A inteligência deixa de responder apenas a comandos e passa a acompanhar a jornada.',
      },
    };
  }

  // SLIDE 7 — Maturidade agêntica em 5 níveis
  if (s.id === 'governance') {
    return {
      ...s,
      kind: 'narrative',
      accent: 'violet',
      title:
        'Agentes ampliam a capacidade da operação de enxergar, priorizar e agir.',
      subtitle: 'Cinco níveis progressivos de maturidade agêntica',
      content: {
        headline: 'Maturidade agêntica',
        cardVisual: 'ascent',
        lead:
          'Os agentes não têm uma função única. Atuam em níveis progressivos de maturidade:',
        valueStagesFlat: true,
        valueStagesGridCols: 3,
        valueStagesRevealChunkSize: 3,
        valueStages: [
          {
            number: '01',
            label: 'Informar',
            description: 'Organizam dados e apresentam contexto relevante no momento certo.',
          },
          {
            number: '02',
            label: 'Analisar',
            description: 'Identificam padrões, riscos, inconsistências e gargalos.',
          },
          {
            number: '03',
            label: 'Recomendar',
            description: 'Sugerem próximos passos, correções e priorizações.',
          },
          {
            number: '04',
            label: 'Executar sob controle',
            description: 'Acionam fluxos, abrem pendências e direcionam tarefas com supervisão humana.',
          },
          {
            number: '05',
            label: 'Coordenar',
            description: 'Conectam etapas da jornada e sustentam contexto entre áreas, equipes e momentos.',
          },
        ],
        attentionPhrase:
          'A maturidade agêntica não depende de mais IA. Depende de mais base operacional.',
        bullets: [],
        revealPillars: [],
      },
    };
  }

  // SLIDE 8 — Base que a era agêntica exige
  if (s.id === 'roadmap') {
    return {
      ...s,
      kind: 'narrative',
      accent: 'violet',
      title: 'Agentes precisam de uma operação preparada para agir.',
      subtitle: 'Sem arquitetura, IA vira mais uma camada de complexidade',
      content: {
        headline: 'Base operacional',
        cardVisual: 'pillars',
        valueStagesLead: 'A base que a era agêntica exige:',
        valueStagesFlat: true,
        valueStagesGridCols: 4,
        valueStagesRevealChunkSize: 4,
        valueStages: [
          { number: '🔒', label: 'Dados governados' },
          { number: '🔗', label: 'Interoperabilidade real' },
          { number: '🌿', label: 'Contexto clínico e operacional' },
          { number: '⚙️', label: 'Fluxos conectados' },
          { number: '📜', label: 'Regras de atuação definidas' },
          { number: '👁️', label: 'Supervisão humana' },
          { number: '🔖', label: 'Rastreabilidade' },
          { number: '🛡️', label: 'Segurança e conformidade' },
        ],
        evidenceMetrics: [
          {
            style: 'bar',
            badge: 'Dado · Evidência · Deloitte',
            value: 0,
            unit: '',
            headline:
              'O futuro da saúde exige dados radicalmente interoperáveis, plataformas abertas e seguras e arquitetura preparada.',
            context:
              'Eficiência, acesso e melhores resultados não dependem de mais ferramentas isoladas — dependem da base que as conecta.',
          },
        ],
        attentionPhrase: 'Sem arquitetura, a IA vira mais uma camada de complexidade.',
        bullets: [],
      },
    };
  }

  return s;
});

/** Cards extras inseridos antes do closing — base Salux (9) e ANTES/DEPOIS (10). */
const governancaBaseStep: PresentationStep = {
  id: 'governanca-base',
  index: 9,
  title: 'Uma base operacional para a saúde agir com inteligência.',
  subtitle: 'Ecossistema Salux como arquitetura, não como catálogo',
  position: { x: -1320, y: 3320 },
  scale: 1.2,
  kind: 'narrative',
  accent: 'violet',
  content: {
    headline: 'Base Operacional Salux',
    cardVisual: 'constellation',
    lead:
      'A nova lógica exige uma arquitetura capaz de conectar os principais pontos da operação em saúde:',
    valueStagesFlat: true,
    valueStagesGridCols: 4,
    valueStagesRevealChunkSize: 4,
    valueStages: [
      { number: '◆', label: 'Assistência' },
      { number: '◆', label: 'Receita' },
      { number: '◆', label: 'Diagnóstico' },
      { number: '◆', label: 'Documentação' },
      { number: '◆', label: 'Força de trabalho' },
      { number: '◆', label: 'Continuidade do cuidado' },
      { number: '◆', label: 'Gestão' },
      { number: '◆', label: 'Decisão' },
    ],
    body:
      'O Ecossistema Salux estrutura essa base: conecta capacidades, organiza fluxos e cria as condições para que agentes atuem com contexto, governança e impacto real.',
    attentionPhrase:
      'A inteligência só gera valor quando encontra uma operação preparada para executá-la.',
  },
};

const governancaTransformStep: PresentationStep = {
  id: 'governanca-transform',
  index: 10,
  title: 'Da informação registrada à operação coordenada.',
  subtitle: 'A virada da era agêntica em sete pares ANTES/DEPOIS',
  position: { x: 1320, y: 3320 },
  scale: 1.2,
  kind: 'narrative',
  accent: 'violet',
  content: {
    headline: 'Virada agêntica',
    cardVisual: 'phase',
    beforeAfter: {
      before: [
        'Dados dispersos',
        'Processos fragmentados',
        'Decisões tardias',
        'Alertas genéricos',
        'Retrabalho',
        'Perda de continuidade',
        'Gestão reativa',
      ],
      after: [
        'Contexto acionável',
        'Fluxos conectados',
        'Decisões orientadas',
        'Riscos priorizados',
        'Ações coordenadas',
        'Continuidade da jornada',
        'Gestão em tempo próximo ao real',
      ],
    },
    attentionPhrase:
      'A operação deixa de ser apenas navegada e passa a ser ativada por inteligência.',
    bullets: [],
  },
};

/** Card 11 — Quatro dimensões de valor da era agêntica. */
const governancaValueDimensionsStep: PresentationStep = {
  id: 'governanca-value-dimensions',
  index: 11,
  title: 'A era agêntica atua onde a saúde mais perde valor, tempo e continuidade.',
  subtitle: 'Valor entregue pela era agêntica',
  position: { x: -1320, y: 4480 },
  scale: 1.2,
  kind: 'narrative',
  accent: 'violet',
  content: {
    headline: 'Dimensões de valor',
    cardVisual: 'prism',
    valueStagesFlat: true,
    valueStagesGridCols: 2,
    valueStagesRevealChunkSize: 2,
    valueStagesShowDescription: true,
    valueStages: [
      {
        number: '💰',
        label: 'Valor econômico',
        description:
          'Proteção de receita. Redução de glosas. Menos retrabalho. Mais previsibilidade financeira.',
      },
      {
        number: '🩺',
        label: 'Valor assistencial',
        description:
          'Contexto clínico contínuo. Alertas relevantes. Diagnóstico integrado. Cuidado além da alta.',
      },
      {
        number: '⚙️',
        label: 'Valor operacional',
        description:
          'Gargalos antecipados. Escalas mais coordenadas. Melhor uso da capacidade instalada. Produtividade com controle.',
      },
      {
        number: '🌐',
        label: 'Valor sistêmico',
        description:
          'Redes mais coordenadas. Filas priorizadas por contexto. Crônicos monitorados. Acesso ampliado com mais inteligência de gestão.',
      },
    ],
    attentionPhrase:
      'A era agêntica gera valor onde os sistemas atuais ainda não conseguem agir com contexto, coordenação e continuidade.',
  },
};

/** Card 12 — A diferença está na arquitetura, não na IA. */
const governancaArchDifferenceStep: PresentationStep = {
  id: 'governanca-arch-difference',
  index: 12,
  title: 'A diferença não está na IA. Está na arquitetura que permite que ela atue.',
  subtitle: 'Por que a era agêntica exige uma nova base de operação',
  position: { x: 1320, y: 4480 },
  scale: 1.2,
  kind: 'narrative',
  accent: 'violet',
  content: {
    headline: 'Nova base de operação',
    cardVisual: 'lens',
    lead:
      'A era agêntica não se resume a usar IA. Trata-se de adotar uma nova lógica de operação, onde:',
    valueStagesFlat: true,
    valueStagesGridCols: 2,
    valueStagesRevealChunkSize: 2,
    valueStages: [
      { number: '✕', label: 'Ter IA é insuficiente.' },
      { number: '✕', label: 'Ter agentes isolados é insuficiente.' },
      { number: '✕', label: 'Ter dados sem contexto é insuficiente.' },
      { number: '✕', label: 'Ter sistemas sem coordenação é insuficiente.' },
    ],
    attentionPhrase:
      'Em IA agêntica em saúde, ganha quem combina capacidade técnica, contexto operacional e governança real — não quem tem só mais ferramentas.',
  },
};

/** Card 13 — Passagem da operação digital para a operação coordenada por inteligência. */
const governancaPassageStep: PresentationStep = {
  id: 'governanca-passage',
  index: 13,
  title:
    'A era agêntica marca a passagem da operação digital para a operação coordenada por inteligência.',
  subtitle: 'Encerramento de racional e CTA',
  position: { x: 0, y: 5640 },
  scale: 1.2,
  kind: 'narrative',
  accent: 'violet',
  content: {
    headline: 'Próximo salto',
    cardVisual: 'portal',
    lead:
      'Depois da digitalização, o próximo salto será transformar dados, processos e inteligência em capacidade real de execução.',
    attentionPhrase:
      'Não é sobre ter mais IA. É sobre ter uma operação que sabe o que fazer com ela.',
    closingQuestionLabel: 'CTA · Pergunta-gatilho',
    closingQuestion:
      'Sua operação está preparada para a era agêntica? Vamos mapear juntos os próximos passos.',
  },
};

const _intermediate = governancaSteps as PresentationStep[];

/** Sequência final — insere base (9), transformação (10) e cards 11-13 antes do closing. */
export const governancaStepsResolved: PresentationStep[] = (() => {
  const extras: PresentationStep[] = [
    governancaBaseStep,
    governancaTransformStep,
    governancaValueDimensionsStep,
    governancaArchDifferenceStep,
    governancaPassageStep,
  ];
  const closingIdx = _intermediate.findIndex((s) => s.id === 'closing');
  if (closingIdx < 0) return [..._intermediate, ...extras].map((s, i) => ({ ...s, index: i }));
  const before = _intermediate.slice(0, closingIdx);
  const closing = _intermediate[closingIdx];
  return [...before, ...extras, closing].map((s, i) => ({ ...s, index: i }));
})();
