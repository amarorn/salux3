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
        title: 'CRESCIMENTO QUE PESA',
        subtitle: 'Onde a expansão começa a se transformar em custo',
        content: {
          headline: 'Onde o crescimento da sua instituição começa a pesar?',
          bullets: [
            'Abertura de nova unidade',
            'Ampliação de serviços',
            'Diagnóstico que vira gargalo',
            'Equipe que não acompanha a demanda',
            'Integrações costuradas a cada nova frente',
            'Expansão física: mais estrutura, equipamento e custo',
            'Perda de previsibilidade econômica',
          ],
          highlightPhrases: [
            'O crescimento em saúde nem sempre trava por falta de demanda.',
            'Muitas vezes, trava porque a base não acompanha a ambição da instituição.',
          ],
          closingHighlight: 'Sua instituição está crescendo por arquitetura ou por acúmulo?',
          painPointsLayout: true,
        },
      };
    }

    if (s.id === 'why-agents') {
      return {
        ...s,
        title: 'CRESCER ADICIONANDO ESFORÇO',
        subtitle: 'A expansão amplia capacidade — e também complexidade',
        content: {
          headline: 'O hospital cresce. Mas cresce adicionando esforço.',
          bullets: [
            'Mais sistemas',
            'Mais integrações',
            'Mais controles paralelos',
            'Mais adaptações locais',
            'Mais dependência de pessoas-chave',
            'Mais estrutura física para cada nova frente',
            'Mais pressão sobre equipes e áreas críticas',
          ],
          highlightPhrases: [
            'Isso não é um desvio pontual. É um padrão.',
            'A instituição amplia capacidade, mas também amplia complexidade.',
            'Quando crescer exige sempre mais costura, a expansão começa a virar atrito operacional.',
          ],
          painPointsLayout: true,
          painPointsBackdrop: 'stacked' as const,
          painPointsBalloon: true,
          painPointsTriggerLabel: 'Onde isso aparece? Ver os 7 pontos',
          painPointsBalloonTitle: 'Onde o crescimento adiciona esforço',
          closingQuestion: 'Sua instituição está crescendo por arquitetura ou por acúmulo?',
        },
      };
    }

    if (s.id === 'architecture') {
      return {
        ...s,
        kind: 'narrative' as const,
        title: 'O ATRITO QUE SE ACUMULA',
        subtitle: 'A operação cresce por partes, mas não funciona como ecossistema',
        content: {
          headline:
            'O atrito não aparece em um único ponto. Ele se acumula ao longo da operação.',
          bullets: [
            'Abertura de nova unidade',
            'Implantação de novo serviço',
            'Integração entre sistemas',
            'Coordenação das equipes',
            'Capacidade diagnóstica',
            'Expansão do atendimento',
            'Controle econômico',
            'Áreas críticas',
          ],
          highlightPhrases: [
            'Cada ponto parece administrável isoladamente.',
            'Mas, juntos, revelam o mesmo problema:',
            'A operação cresce por partes, mas não funciona como ecossistema.',
          ],
          painPointsLayout: true,
          painPointsBackdrop: 'web' as const,
        },
      };
    }

    if (s.id === 'journey') {
      return {
        ...s,
        kind: 'narrative' as const,
        title: 'NÃO É FALTA DE TECNOLOGIA',
        subtitle: 'Conjunto de sistemas não forma, necessariamente, uma arquitetura',
        content: {
          headline: 'O problema não é falta de tecnologia.',
          bullets: [
            'Sistemas',
            'Módulos',
            'BI',
            'Prontuário',
            'Integrações',
            'Controles',
            'Soluções especializadas',
          ],
          highlightPhrases: [
            'Mas um conjunto de sistemas não forma, necessariamente, uma arquitetura.',
            'Durante anos, a saúde avançou informatizando partes da operação. Isso foi necessário — mas informatizar partes não significa coordenar o todo.',
            'É nesse ponto que o crescimento começa a travar.',
          ],
          painPointsLayout: true,
        },
      };
    }

    if (s.id === 'integration') {
      return {
        ...s,
        kind: 'highlight' as const,
        title: 'CRESCIMENTO POR ACÚMULO',
        subtitle: 'Adicionar, integrar, adaptar, ajustar, compensar',
        content: {
          headline: 'O modelo atual ainda cresce por acúmulo.',
          body:
            'Adiciona. Integra. Adapta. Ajusta. Compensa.\nNo curto prazo, funciona. No médio prazo, cria peso.\n\nCada nova frente exige nova costura. Cada nova unidade exige novos ajustes. Cada novo serviço aumenta dependências. Cada novo volume pressiona equipe, diagnóstico, atendimento e controle.',
          evidenceCard: {
            label: 'Card de evidência',
            metric: 'Até 80%',
            text:
              'do gasto de TI pode ser consumido por operação e manutenção em ambientes intensivos em legado.',
          },
          attentionPhrase:
            'Quando a base é pesada, crescer custa mais antes mesmo de começar.',
          closingHighlight: 'O limite não está apenas na ferramenta.',
        },
      };
    }

    if (s.id === 'governance') {
      return {
        ...s,
        kind: 'highlight' as const,
        title: 'A PERGUNTA MUDA DE EIXO',
        subtitle: 'Da pergunta sobre sistema para a pergunta sobre base',
        content: {
          headline: 'Que base permite crescer sem multiplicar complexidade?',
          body:
            'A pergunta deixa de ser: qual sistema precisamos adicionar?\nE passa a ser: que base permite crescer sem multiplicar complexidade?\n\nA inovação real não está em adicionar mais camadas. Está em remover fricção para que a instituição cresça com mais controle.',
          evidenceCard: {
            label: 'Card de evidência',
            metric: '12 a 24 meses',
            text:
              'podem ser necessários em implementações hospitalares amplas. A expansão não espera ciclos pesados de implantação.',
          },
          attentionPhrase: 'Crescer por arquitetura é diferente de crescer por acúmulo.',
          layersToBase: true,
        },
      };
    }

    if (s.id === 'roadmap') {
      return {
        ...s,
        kind: 'narrative' as const,
        title: 'CAPACIDADES COORDENADAS',
        subtitle: 'Não se resolve com uma solução isolada',
        content: {
          headline: 'Isso não se resolve com uma solução isolada.',
          bullets: [
            'Base digital da operação',
            'Capilaridade assistencial',
            'Continuidade diagnóstica',
            'Gestão da força de trabalho',
            'Governança documental',
            'Controle econômico',
            'Áreas críticas',
            'Inteligência em tempo real',
          ],
          highlightPhrases: [
            'Esses elementos não podem operar como ilhas. Eles precisam funcionar como capacidades coordenadas.',
            'Crescer com controle exige que dados, processos, equipes, diagnóstico, cuidado e decisão operem sobre uma mesma lógica.',
          ],
          painPointsLayout: true,
        },
      };
    }

    if (s.id === 'closing') {
      return {
        ...s,
        title: 'Sua instituição está crescendo por arquitetura ou por acúmulo?',
        subtitle: 'Ecossistema Salux — a base para uma nova forma de operar a saúde',
        content: {
          headline: 'Encerramento',
          body:
            'Esse movimento pode começar pelo ponto onde a expansão hoje gera mais atrito.\n\nUma nova unidade. Uma nova especialidade. Um gargalo diagnóstico. Uma dificuldade de integração. Um desafio de equipe. Uma frente fora da estrutura física. Uma perda de previsibilidade econômica.',
          highlightPhrases: [
            'Mas o impacto real acontece quando esses pontos deixam de ser tratados isoladamente e passam a funcionar como parte de uma mesma arquitetura de crescimento.',
            'Ecossistema Salux — a base para uma nova forma de operar a saúde.',
          ],
          meta: {
            Próximo: 'Workshop de descoberta · 2 horas',
            Contato: 'salux@beanalytic.com.br',
          },
        },
      };
    }

    return s;
  });

/** Cards adicionais 8 a 11 — capacidades, caminhos, agentes, resultados. */
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
    title: 'POR ONDE COMEÇA A TRAVA?',
    subtitle: 'Caminhos consultivos — uma dor, uma resposta coordenada',
    position: { x: 1320, y: 2380 },
    scale: 1.2,
    kind: 'pathways',
    accent: 'cyan',
    content: {
      headline: 'Por onde o crescimento está travando hoje?',
      pathways: [
        {
          pain: 'Legado / sistemas / integração',
          product: 'Plataforma Salux + INITIA',
        },
        {
          pain: 'Capilaridade / acesso / expansão sem nova estrutura física',
          product: 'CloudHealth',
        },
        {
          pain: 'Imagem / laudo / volume diagnóstico',
          product: 'Med.Place',
        },
        {
          pain: 'Equipe / escala / absenteísmo / custo operacional',
          product: 'StarGrid',
        },
        {
          pain: 'Documentação / papel / rastreabilidade / conformidade',
          product: 'ZeroDox',
        },
        {
          pain: 'Faturamento / glosas / previsibilidade econômica',
          product: 'TI Hospitalar',
        },
        {
          pain: 'Centro cirúrgico / áreas críticas / visibilidade operacional',
          product: 'SkyMed + Vision Pilot / AGCOM',
        },
      ],
      highlightPhrases: [
        'O ponto de entrada pode variar. Mas a resposta precisa ser coordenada.',
      ],
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
    title: 'RESULTADO',
    subtitle: 'Reduzir o custo estrutural de crescer',
    position: { x: 1320, y: 3320 },
    scale: 1.2,
    kind: 'results',
    accent: 'amber',
    content: {
      headline:
        'O valor não está apenas em crescer mais. Está em reduzir o custo estrutural de crescer.',
      resultsCards: [
        'Mais velocidade',
        'Mais previsibilidade',
        'Mais consistência',
        'Menos retrabalho',
        'Menos fricção estrutural',
        'Mais controle sobre a escala',
      ],
      highlightPhrases: [
        'O crescimento deixa de depender apenas de esforço contínuo de compensação.',
        'Passa a ser sustentado por uma base mais coordenada, modular e inteligente.',
      ],
    },
  },
];

/** Encadeia os steps base (limit → closing) com os 4 novos antes do fechamento. */
function assemble(): PresentationStep[] {
  const closingIdx = baseOperacao.findIndex((s) => s.id === 'closing');
  const before = baseOperacao.slice(0, closingIdx);
  const closing = baseOperacao[closingIdx];
  const all = [...before, ...extraOperacao, closing];
  return all.map((s, i) => ({ ...s, index: i }));
}

export const operacaoSteps: PresentationStep[] = assemble();
