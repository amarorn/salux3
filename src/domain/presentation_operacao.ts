import type { PresentationStep } from './types';
import { steps as baseSteps } from './presentation';

export const presentationOperacaoMeta = {
  title: 'Operação que cresce sem virar atrito',
  subtitle: 'Da soma de sistemas à coordenação como ecossistema',
  author: '',
};

function cloneSteps(steps: PresentationStep[]): PresentationStep[] {
  return steps.map((s) => ({
    ...s,
    content: { ...s.content },
  }));
}

/** Trilha Operação: narrativa sobre crescimento institucional e atrito acumulado.
 *  Briefing Trilha 3 — Hospitalar 2026. */
const baseOperacao: PresentationStep[] = cloneSteps(baseSteps)
  .filter((s) => s.id !== 'cover')
  .map((s, i) => ({ ...s, index: i }))
  .map((s) => {
    if (s.id === 'limit') {
      return {
        ...s,
        kind: 'narrative' as const,
        accent: 'rose' as const,
        title: 'Onde o crescimento da sua instituição começa a pesar?',
        subtitle: 'Pontos de atrito que aparecem com a expansão',
        content: {
          headline: 'Crescimento que pesa',
          cardVisual: 'ladder',
          valueStagesLead: 'Reconhece algum destes pontos de atrito?',
          valueStagesFlat: true,
          valueStagesGridCols: 3,
          valueStages: [
            { number: '🏗', label: 'Abertura de nova unidade' },
            { number: '🔗', label: 'Integrações que precisam ser costuradas a cada nova frente' },
            { number: '👥', label: 'Equipe que não acompanha a demanda' },
            { number: '🔬', label: 'Diagnóstico que vira gargalo' },
            { number: '📉', label: 'Perda de previsibilidade econômica com o crescimento' },
            { number: '🏛', label: 'Expansão física que exige mais estrutura e mais custo' },
          ],
          closingQuestion: 'Sua instituição está crescendo por arquitetura — ou por acúmulo?',
          closingQuestionLabel: 'CTA · Pergunta-gatilho',
          bullets: [],
          painPointsLayout: false,
        },
      };
    }

    if (s.id === 'why-agents') {
      return {
        ...s,
        kind: 'narrative' as const,
        accent: 'amber' as const,
        title: 'O hospital cresce. Mas cresce adicionando esforço.',
        subtitle: 'A expansão amplia capacidade — e também complexidade',
        content: {
          headline: 'Crescer adicionando esforço',
          cardVisual: 'tide',
          valueStagesFlat: true,
          valueStagesGridCols: 4,
          valueStages: [
            { number: '+', label: 'Mais sistemas' },
            { number: '+', label: 'Mais integrações' },
            { number: '+', label: 'Mais controles paralelos' },
            { number: '+', label: 'Mais adaptações locais' },
            { number: '+', label: 'Mais dependência de pessoas-chave' },
            { number: '+', label: 'Mais estrutura física para cada nova frente' },
            { number: '+', label: 'Mais pressão sobre equipes e áreas críticas' },
          ],
          body:
            'Isso não é um desvio pontual. É um padrão.\nA instituição amplia capacidade — mas também amplia complexidade.',
          attentionPhrase:
            'Quando crescer exige sempre mais costura, a expansão começa a virar atrito operacional.',
          bullets: [],
          highlightPhrases: [],
          painPointsLayout: false,
        },
      };
    }

    if (s.id === 'architecture') {
      return {
        ...s,
        kind: 'narrative' as const,
        accent: 'cyan' as const,
        title: 'O problema não é falta de tecnologia.',
        subtitle: 'Um conjunto de sistemas não forma, necessariamente, uma arquitetura',
        content: {
          headline: 'Tecnologia × arquitetura',
          cardVisual: 'gear',
          lead:
            'A maioria das instituições já tem sistemas, módulos, BI, prontuário, integrações e controles.',
          attentionPhrase:
            'Um conjunto de sistemas não forma, necessariamente, uma arquitetura.',
          body:
            'Durante anos, a saúde avançou informatizando partes da operação. Isso foi necessário.\nMas informatizar partes não significa coordenar o todo.',
          evidenceMetrics: [
            {
              style: 'gauge',
              badge: 'Dado · Evidência',
              prefix: 'até',
              value: 80,
              unit: '%',
              headline:
                'do gasto de TI pode ser consumido por operação e manutenção em ambientes com legado pesado.',
              context:
                'Quando a base é pesada, crescer custa mais antes mesmo de começar. A instituição investe para sustentar o passado — e perde espaço para construir a próxima base da operação.',
            },
          ],
          bullets: [],
          highlightPhrases: [],
          painPointsLayout: false,
        },
      };
    }

    if (s.id === 'journey') {
      return {
        ...s,
        kind: 'narrative' as const,
        accent: 'amber' as const,
        title: 'A pergunta mudou.',
        subtitle: 'Do sistema-a-adicionar para a base que permite crescer sem multiplicar complexidade',
        content: {
          headline: 'A pergunta mudou.',
          cardVisual: 'lens',
          contrastPair: {
            left: {
              label: 'Antes',
              tone: 'warm',
              text: 'Qual sistema precisamos adicionar?',
            },
            right: {
              label: 'Agora',
              tone: 'cool',
              text: 'Que base permite crescer sem multiplicar complexidade?',
            },
          },
          evidenceMetrics: [
            {
              style: 'range',
              badge: 'Dado · Evidência',
              value: 12,
              rangeEnd: 24,
              valueLabel: 'meses',
              rangeMax: 36,
              headline:
                'é o tempo que implementações hospitalares amplas podem exigir.',
              context:
                'A expansão não espera ciclos pesados de implantação. A demanda não espera. A pressão assistencial não espera.',
            },
          ],
          body: 'A inovação real não está em adicionar mais camadas.',
          attentionPhrase:
            'Está em remover fricção para que a instituição cresça com mais controle.',
          closingHighlight: 'Crescer por arquitetura é diferente de crescer por acúmulo.',
          bullets: [],
          highlightPhrases: [],
          painPointsLayout: false,
        },
      };
    }

    if (s.id === 'integration') {
      return {
        ...s,
        kind: 'narrative' as const,
        accent: 'cyan' as const,
        title: 'Crescer com controle exige uma base, não uma somatória.',
        subtitle: 'Os 8 elementos de uma operação coordenada',
        content: {
          headline: 'Base coordenada',
          cardVisual: 'alignment',
          valueStagesLead:
            'Não se trata de adicionar mais uma solução. Trata-se de fazer todas as capacidades operarem sobre a mesma lógica.\n\nOs 8 elementos de uma operação coordenada:',
          valueStagesFlat: true,
          valueStagesGridCols: 4,
          valueStages: [
            { number: '01', label: 'Base digital da operação' },
            { number: '02', label: 'Capilaridade assistencial' },
            { number: '03', label: 'Continuidade diagnóstica' },
            { number: '04', label: 'Gestão da força de trabalho' },
            { number: '05', label: 'Governança documental' },
            { number: '06', label: 'Controle econômico' },
            { number: '07', label: 'Áreas críticas' },
            { number: '08', label: 'Inteligência em tempo real' },
          ],
          attentionPhrase:
            'Quando esses elementos operam como ecossistema, crescer deixa de exigir sempre mais costura.',
        },
      };
    }

    if (s.id === 'governance') {
      return {
        ...s,
        kind: 'capacities' as const,
        accent: 'cyan' as const,
        title: 'Essa arquitetura já existe na prática.',
        subtitle: 'Capacidades centrais e de sustentação da escala',
        content: {
          headline: 'Essa arquitetura já existe na prática.',
          cardVisual: 'modular',
          body:
            'O Ecossistema Salux organiza capacidades para cada ponto da operação — de forma integrada, não como produtos isolados.',
          capacityGroups: [
            {
              title: 'Capacidades centrais da escala',
              tone: 'core',
              items: [
                {
                  name: 'Base digital',
                  subtitle: 'Plataforma Salux + INITIA',
                  description: 'Organiza dados, processos e fluxos críticos.',
                  tagline: 'Coordenação desde a origem.',
                },
                {
                  name: 'Capilaridade',
                  subtitle: 'CloudHealth',
                  description:
                    'Amplia atendimento, acesso e acompanhamento sem depender de nova unidade física.',
                  tagline: 'Mais alcance sem expansão física linear.',
                },
                {
                  name: 'Diagnóstico',
                  subtitle: 'Med.Place',
                  description:
                    'Diagnóstico em rede e disponibilidade contínua. O volume cresce sem criar ruptura.',
                  tagline: 'Escala diagnóstica sem gargalo.',
                },
                {
                  name: 'Força de trabalho',
                  subtitle: 'StarGrid',
                  description:
                    'Coordena demanda, cobertura, absenteísmo e custo.',
                  tagline: 'Equipe como capacidade instalada.',
                },
              ],
            },
            {
              title: 'Capacidades de sustentação da escala',
              tone: 'support',
              items: [
                {
                  name: 'Governança documental',
                  subtitle: 'ZeroDox',
                  description:
                    'Rastreabilidade, conformidade e continuidade.',
                  tagline: 'Crescer sem fragilidade documental.',
                },
                {
                  name: 'Controle econômico',
                  subtitle: 'TI Hospitalar',
                  description:
                    'Faturamento, glosas e previsibilidade financeira.',
                  tagline: 'Crescimento com controle de resultado.',
                },
                {
                  name: 'Áreas críticas',
                  subtitle: 'SkyMed + VisionPilot · AGCOM',
                  description:
                    'Fluxos físicos, ocupação e sinais operacionais acompanhados em tempo real.',
                  tagline: 'A operação acompanhada enquanto acontece.',
                },
              ],
            },
          ],
        },
      };
    }

    if (s.id === 'roadmap') {
      return {
        ...s,
        kind: 'narrative' as const,
        accent: 'emerald' as const,
        title: 'Com o INITIA, a operação deixa de correr atrás da informação.',
        subtitle: 'Agentes que ampliam a capacidade de resposta da operação',
        content: {
          headline: 'INITIA · Agentes',
          cardVisual: 'signal',
          contrastPair: {
            left: {
              label: 'Sem INITIA',
              tone: 'warm',
              text:
                'O usuário procura dados.\nInterpreta manualmente.\nDecide com visão parcial.\nAciona tarde.',
            },
            right: {
              label: 'Com INITIA',
              tone: 'cool',
              text:
                'A informação se apresenta.\nO contexto acompanha.\nO agente orienta.\nA ação parte do dado.',
            },
          },
          body: 'O que os Agentes fazem na operação:',
          bullets: [
            'Identificam gargalos e interpretam capacidade disponível',
            'Organizam contexto e priorizam fluxos operacionais',
            'Apoiam alocação de equipes conforme demanda e criticidade',
            'Sinalizam riscos antes que virem problema',
            'Recomendam ações e executam tarefas sob governança',
          ],
          attentionPhrase:
            'Os agentes não substituem a equipe. Ampliam a capacidade de resposta da operação.',
          closingHighlight:
            'A tecnologia deixa de apenas registrar a expansão — e passa a ajudar a coordená-la.',
          highlightPhrases: [],
          painPointsLayout: false,
        },
      };
    }

    if (s.id === 'closing') {
      return {
        ...s,
        accent: 'emerald' as const,
        title: 'Sua instituição está crescendo por arquitetura — ou por acúmulo?',
        subtitle: 'Mapear juntos onde a expansão gera mais atrito',
        content: {
          headline: 'Sua instituição está crescendo por arquitetura — ou por acúmulo?',
          cardVisual: 'compass',
          body: 'Esse movimento pode começar pelo ponto onde a expansão hoje gera mais atrito.',
          valueStagesFlat: true,
          valueStagesGridCols: 3,
          valueStages: [
            { number: '📍', label: 'Uma nova unidade' },
            { number: '📍', label: 'Uma nova especialidade' },
            { number: '📍', label: 'Um gargalo diagnóstico' },
            { number: '📍', label: 'Uma dificuldade de integração' },
            { number: '📍', label: 'Um desafio de equipe' },
            { number: '📍', label: 'Uma perda de previsibilidade econômica' },
          ],
          attentionPhrase:
            'O impacto real acontece quando esses pontos deixam de ser tratados isoladamente e passam a funcionar como parte de uma mesma arquitetura de crescimento.',
          closingQuestionLabel: 'CTA · Pergunta-gatilho',
          closingQuestion:
            'Podemos mapear juntos onde o crescimento está gerando mais atrito!',
          closingHighlight:
            'Ecossistema Salux · A base para uma nova forma de operar a saúde.',
          highlightPhrases: [],
        },
      };
    }

    return s;
  });

/** Cards adicionais — disponíveis para serem inseridos via assemble(). */
const extraOperacao: PresentationStep[] = [
  {
    id: 'capacities',
    index: 0,
    title: 'CAPACIDADES DA ESCALA',
    subtitle: 'Essa arquitetura não é teórica. Ela já existe na prática.',
    position: { x: -1320, y: 2380 },
    scale: 1.2,
    kind: 'capacities',
    accent: 'violet',
    content: {
      headline: 'Essa arquitetura não é teórica. Ela já existe na prática.',
      capacityGroups: [
        {
          title: 'Capacidades centrais da escala',
          tone: 'core',
          items: [
            {
              name: 'Plataforma Salux + INITIA',
              subtitle: 'Base digital da operação',
              description:
                'A expansão precisa de um núcleo capaz de organizar dados, processos e fluxos críticos.',
              tagline: 'Coordenação desde a origem.',
            },
            {
              name: 'CloudHealth',
              subtitle: 'Capilaridade assistencial',
              description:
                'A instituição pode ampliar acesso, cobertura e acompanhamento sem depender sempre de nova unidade.',
              tagline: 'Mais alcance sem expansão física linear.',
            },
            {
              name: 'Med.Place',
              subtitle: 'Continuidade diagnóstica',
              description:
                'O diagnóstico por imagem não pode virar gargalo da expansão.',
              tagline: 'Diagnóstico em escala, sem ruptura operacional.',
            },
            {
              name: 'StarGrid',
              subtitle: 'Gestão da força de trabalho',
              description:
                'Equipe não é apenas recurso. É capacidade instalada em movimento.',
              tagline: 'Escala como governança operacional.',
            },
          ],
        },
        {
          title: 'Capacidades de sustentação da escala',
          tone: 'support',
          items: [
            {
              name: 'ZeroDox',
              subtitle: 'Governança documental',
              description:
                'Quanto maior o volume, maior o risco de fragilidade documental.',
              tagline: 'Rastreabilidade para crescer com segurança.',
            },
            {
              name: 'TI Hospitalar',
              subtitle: 'Controle econômico da escala',
              description:
                'Aumentar volume sem previsibilidade financeira amplia risco.',
              tagline: 'Crescimento com previsibilidade financeira.',
            },
            {
              name: 'SkyMed + Vision Pilot / AGCOM',
              subtitle: 'Áreas críticas e inteligência em tempo real',
              description:
                'Nem toda informação crítica nasce dentro dos sistemas.',
              tagline: 'A operação acompanhada enquanto acontece.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'pathways',
    index: 0,
    title: 'O ponto de entrada pode variar. A resposta precisa ser coordenada.',
    subtitle: 'Caminhos consultivos — onde a expansão está gerando atrito',
    position: { x: 1320, y: 2380 },
    scale: 1.2,
    kind: 'narrative',
    accent: 'cyan',
    content: {
      headline: 'Pontos de entrada',
      cardVisual: 'spotlight',
      valueStagesFlat: true,
      valueStagesGridCols: 3,
      valueStages: [
        { number: '🔧', label: 'Legado / Integração', description: '→ Plataforma Salux + INITIA' },
        { number: '📡', label: 'Capilaridade', description: '→ CloudHealth' },
        { number: '🔬', label: 'Imagem / Diagnóstico', description: '→ Med.Place' },
        { number: '👥', label: 'Equipe / Custo operacional', description: '→ StarGrid' },
        { number: '📄', label: 'Documentação', description: '→ ZeroDox' },
        { number: '💰', label: 'Faturamento / Glosas', description: '→ TI Hospitalar' },
        { number: '🏥', label: 'Centro cirúrgico / Áreas críticas', description: '→ SkyMed + VisionPilot / AGCOM' },
      ],
      closingQuestionLabel: 'CTA · Pergunta-gatilho',
      closingQuestion:
        'Por onde a expansão está gerando mais atrito hoje na sua operação?',
    },
  },
  {
    id: 'agents-flow',
    index: 0,
    title: 'INITIA E AGENTES',
    subtitle: 'A informação que se apresenta — a ação que parte do dado',
    position: { x: -1320, y: 3320 },
    scale: 1.2,
    kind: 'agents-flow',
    accent: 'emerald',
    content: {
      headline:
        'Com o INITIA, a operação deixa de depender apenas de navegação, leitura manual e ação tardia.',
      beforeAfter: {
        before: ['O usuário procura', 'Interpreta', 'Decide', 'Aciona'],
        after: [
          'A informação se apresenta',
          'O contexto acompanha',
          'O agente orienta',
          'A ação parte do dado',
        ],
      },
      agentFunctions: [
        'Identificar gargalos',
        'Interpretar capacidade',
        'Organizar contexto',
        'Priorizar fluxos',
        'Apoiar alocação de equipes',
        'Sinalizar riscos',
        'Recomendar ações',
        'Executar tarefas sob governança',
      ],
      highlightPhrases: [
        'Os agentes não são chatbots. Não são automações isoladas. São uma camada operacional distribuída.',
        'A tecnologia deixa de apenas registrar a expansão e passa a ajudar a coordená-la.',
      ],
    },
  },
  {
    id: 'results',
    index: 0,
    title: 'O valor não está em crescer mais. Está em reduzir o custo estrutural de crescer.',
    subtitle: 'Resultado: base coordenada, expansão sem multiplicar complexidade',
    position: { x: 1320, y: 3320 },
    scale: 1.2,
    kind: 'narrative',
    accent: 'emerald',
    content: {
      headline: 'Resultado',
      cardVisual: 'helix',
      valueStagesLead:
        'Com uma base coordenada, o crescimento deixa de depender de esforço contínuo de compensação.',
      valueStagesFlat: true,
      valueStagesGridCols: 3,
      valueStages: [
        { number: '✓', label: 'Mais velocidade na abertura de novas frentes' },
        { number: '✓', label: 'Mais previsibilidade sobre demanda e capacidade' },
        { number: '✓', label: 'Mais consistência entre unidades e serviços' },
        { number: '✓', label: 'Menos retrabalho e costura manual a cada expansão' },
        { number: '✓', label: 'Menos fricção estrutural e dependências de legado' },
        { number: '✓', label: 'Mais controle sobre a escala sem ampliar complexidade' },
      ],
      attentionPhrase:
        'A próxima etapa da saúde não será definida por quem digitalizou mais partes. Será definida por quem fizer suas capacidades operarem como ecossistema.',
    },
  },
];

/** Sequência final — insere pathways (card 8) e results (card 9) antes do
 *  closing (card 10). Os steps `capacities` e `agents-flow` ficam fora pois
 *  seu conteúdo já está nos cards 6 e 7. */
function assemble(): PresentationStep[] {
  const closingIdx = baseOperacao.findIndex((s) => s.id === 'closing');
  const before = baseOperacao.slice(0, closingIdx);
  const closing = baseOperacao[closingIdx];
  const pathways = extraOperacao.find((s) => s.id === 'pathways')!;
  const results = extraOperacao.find((s) => s.id === 'results')!;
  return [...before, pathways, results, closing].map((s, i) => ({ ...s, index: i }));
}

export const operacaoSteps: PresentationStep[] = assemble();
