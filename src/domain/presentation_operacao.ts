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
 *  Sem capa — entrada direta na pergunta sobre crescimento. */
export const operacaoSteps: PresentationStep[] = cloneSteps(baseSteps)
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
        body:
          'O crescimento em saúde nem sempre trava por falta de demanda.\nMuitas vezes, trava porque a base não acompanha a ambição da instituição.',
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
        body:
          'Isso não é um desvio pontual.\nÉ um padrão.\n\nA instituição amplia capacidade, mas também amplia complexidade.\nQuando crescer exige sempre mais costura, a expansão começa a virar atrito operacional.',
        painPointsLayout: true,
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
      kind: 'narrative',
      title: 'O ATRITO QUE SE ACUMULA',
      subtitle: 'A operação cresce por partes, mas não funciona como ecossistema',
      content: {
        headline: 'O atrito não aparece em um único ponto. Ele se acumula ao longo da operação.',
        bullets: [
          'Abertura de nova unidade.',
          'Implantação de novo serviço.',
          'Integração entre sistemas.',
          'Coordenação das equipes.',
          'Capacidade diagnóstica.',
          'Expansão do atendimento.',
          'Controle econômico.',
          'Áreas críticas.',
        ],
        body:
          'Cada ponto parece administrável isoladamente.\nMas, juntos, revelam o mesmo problema:\na operação cresce por partes, mas não funciona como ecossistema.',
      },
    };
  }

  if (s.id === 'journey') {
    return {
      ...s,
      kind: 'narrative',
      title: 'NÃO É FALTA DE TECNOLOGIA',
      subtitle: 'Conjunto de sistemas não forma, necessariamente, uma arquitetura',
      content: {
        headline: 'O problema não é falta de tecnologia.',
        bullets: [
          'Sistemas.',
          'Módulos.',
          'BI.',
          'Prontuário.',
          'Integrações.',
          'Controles.',
          'Soluções especializadas.',
        ],
        body:
          'Muitas instituições já têm tudo isso.\nMas um conjunto de sistemas não forma, necessariamente, uma arquitetura.\n\nDurante anos, a saúde avançou informatizando partes da operação.\nIsso foi necessário.\nMas informatizar partes não significa coordenar o todo.\n\nÉ nesse ponto que o crescimento começa a travar.',
      },
    };
  }

  if (s.id === 'integration') {
    return {
      ...s,
      kind: 'highlight',
      title: 'O modelo atual ainda cresce por acúmulo.',
      subtitle: 'Crescer por adição vs. crescer por arquitetura',
      content: {
        headline: 'Crescimento por acúmulo',
        body:
          'Adiciona. Integra. Adapta. Ajusta. Compensa.\nNo curto prazo, funciona. No médio prazo, cria peso.\n\nCada nova frente exige nova costura. Cada nova unidade exige novos ajustes. Cada novo serviço aumenta dependências. Cada novo volume pressiona equipe, diagnóstico, atendimento e controle.\n\nAté 80% do gasto de TI pode ser consumido por operação e manutenção em ambientes intensivos em legado.',
        attentionPhrase: 'Quando a base é pesada, crescer custa mais antes mesmo de começar.',
      },
    };
  }

  if (s.id === 'governance') {
    return {
      ...s,
      kind: 'highlight',
      title: 'Que base permite crescer sem multiplicar complexidade?',
      subtitle: 'Da pergunta sobre sistema para a pergunta sobre base',
      content: {
        headline: 'Virada da pergunta',
        body:
          'A pergunta deixa de ser: qual sistema precisamos adicionar?\nE passa a ser: que base permite crescer sem multiplicar complexidade?\n\n12 a 24 meses podem ser necessários em implementações hospitalares amplas. A expansão não espera ciclos pesados de implantação.\n\nA inovação real não está em adicionar mais camadas. Está em remover fricção para que a instituição cresça com mais controle.',
        attentionPhrase: 'Crescer por arquitetura é diferente de crescer por acúmulo.',
      },
    };
  }

  if (s.id === 'roadmap') {
    return {
      ...s,
      title: 'Isso não se resolve com uma solução isolada.',
      subtitle: 'Capacidades coordenadas que sustentam a escala',
      content: {
        headline: 'Capacidades coordenadas',
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
        body:
          'Esses elementos não podem operar como ilhas.\nEles precisam funcionar como capacidades coordenadas.\n\nCrescer com controle exige que dados, processos, equipes, diagnóstico, cuidado e decisão operem sobre uma mesma lógica.',
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
          'Esse movimento pode começar pelo ponto onde a expansão hoje gera mais atrito.\n\nUma nova unidade. Uma nova especialidade. Um gargalo diagnóstico. Uma dificuldade de integração. Um desafio de equipe. Uma frente fora da estrutura física. Uma perda de previsibilidade econômica.\n\nMas o impacto real acontece quando esses pontos deixam de ser tratados isoladamente e passam a funcionar como parte de uma mesma arquitetura de crescimento.',
        meta: {
          Próximo: 'Workshop de descoberta · 2 horas',
          Contato: 'salux@beanalytic.com.br',
        },
      },
    };
  }

  return s;
});
