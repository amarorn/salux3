import type { PresentationStep, RoadmapAgentCard } from './types';
import { steps as baseSteps } from './presentation';

const receitaRoadmapAgents: RoadmapAgentCard[] = [
  {
    title: 'BASE OPERACIONAL',
    segments: [
      {
        type: 'text',
        text:
          'Base estruturada\nreduz retrabalho na origem\nA consistência da operação começa aqui.',
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
          'Acompanhamento do fluxo\nreduz perda ao longo da jornada\nA glosa deixa de ser descoberta no final\ne passa a ser evitada ao longo do processo',
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
          'Documentação estruturada\nsustenta receita e reduz glosa\nO valor deixa de ser questionado\ne passa a ser comprovado',
      },
      { type: 'product', name: 'ZeroDox' },
    ],
  },
  {
    title: 'GESTÃO DA FORÇA DE TRABALHO',
    segments: [
      {
        type: 'text',
        text:
          'Gestão da força de trabalho\nreduz custo invisível e aumenta produtividade\nEscala, alocação e capacidade deixam de ser ruído\ne passam a ser controláveis',
      },
      { type: 'product', name: 'StarGrid' },
    ],
  },
  {
    title: 'CENTRO CIRÚRGICO',
    segments: [
      {
        type: 'text',
        text:
          'Registro contínuo + monitoramento\nreduzem risco clínico e financeiro\nAlta complexidade exige controle constante\nRegistro anestésico estruturado',
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
          'Monitoramento contínuo\naumenta capacidade de resposta\nA operação deixa de ser analisada depois\ne passa a ser acompanhada enquanto acontece',
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

/** Trilha Receita: primeiros slides com narrativa econômica; slides seguintes herdam a base. */
export const receitaSteps: PresentationStep[] = cloneSteps(baseSteps).map((s) => {
  if (s.id === 'cover') {
    return {
      ...s,
      title: 'PROTEÇÃO ECONÔMICA DA OPERAÇÃO EM SAÚDE',
      content: {
        body:
          'Onde a operação de saúde perde valor hoje?\nNo que é visível…\nou no que passa despercebido?\nExiste uma perda que acontece todos os dias na operação —\ne que nem sempre aparece como problema.',
      },
    };
  }
  if (s.id === 'limit') {
    return {
      ...s,
      title: 'DIAGNÓSTICO',
      content: {
        metrics: [
          {
            value: 14.6,
            decimals: 1,
            label: 'De glosa',
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
            suffix: 'do tempo consumido por tarefas administrativas e retrabalho',
            ring: 50,
            trend: [38, 41, 43, 44, 46, 47, 48, 50],
            delta: 2,
            deltaUnit: 'pp',
          },
        ],
        body:
          'Isso não é um desvio pontual.\nÉ um padrão.\nNão se trata apenas de ineficiência.\nÉ valor que deixa de se converter ao longo da operação.',
      },
    };
  }
  if (s.id === 'why-agents') {
    return {
      ...s,
      title: 'FRAGMENTAÇÃO',
      content: {
        body:
          'Essa perda não acontece em um único ponto.\nEla se forma ao longo do processo:\nregistro\nvalidação\nexecução\nconsolidação\n\nSão pequenas rupturas que se acumulam\ne interrompem a conversão do cuidado em receita.',
      },
    };
  }
  if (s.id === 'architecture') {
    return {
      ...s,
      kind: 'narrative',
      title: 'LEITURA ESTRUTURAL',
      content: {
        body:
          'Não é um problema de área.\nÉ um problema de continuidade da operação.\n\nPor isso, ajustes pontuais não resolvem.',
      },
    };
  }
  if (s.id === 'journey') {
    return {
      ...s,
      kind: 'narrative',
      title: 'LIMITE DO MODELO ATUAL',
      content: {
        body:
          'O modelo atual reage ao erro.\nCorrige no final\nquando o valor já se perdeu.\n\nAudita depois\nquando a inconsistência já aconteceu.\n\nRegistra,\nmas não conduz.\n\nGrande parte do esforço acontece tarde demais.',
      },
    };
  }
  if (s.id === 'integration') {
    return {
      ...s,
      kind: 'narrative',
      title: 'VIRADA DE LÓGICA',
      content: {
        body:
          'A questão não é corrigir.\nÉ estruturar a operação.\n\nO valor precisa ser protegido enquanto acontece.\n\nA receita deixa de ser recuperada no final\ne passa a ser construída ao longo da jornada.',
      },
    };
  }
  if (s.id === 'governance') {
    return {
      ...s,
      content: {
        revealPillars: [
          'Base operacional',
          'Ciclo de receita',
          'Governança documental',
          'Gestão da força de trabalho',
          'Centro cirúrgico',
          'Inteligência em tempo real',
        ],
        body:
          'Esses elementos não operam de forma independente.\nEles precisam funcionar como uma base coordenada.',
      },
    };
  }
  if (s.id === 'roadmap') {
    return {
      ...s,
      title: 'Roadmap de adoção',
      content: {
        roadmapAgents: receitaRoadmapAgents,
      },
    };
  }
  return s;
});
