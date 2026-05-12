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
        metrics: [
          {
            value: 38,
            decimals: 0,
            label: 'Sobrecusto por nova frente',
            suffix: 'a mais para integrar cada unidade ou serviço novo à operação',
            ring: 38,
            trend: [18, 22, 25, 28, 30, 33, 36, 38],
            delta: 5,
            deltaUnit: 'pp',
          },
          {
            value: 62,
            decimals: 0,
            label: 'Concentração em pessoas-chave',
            suffix: 'das áreas críticas dependem de ≤ 3 especialistas para operar',
            ring: 62,
            trend: [48, 52, 55, 57, 58, 60, 61, 62],
            delta: 3,
            deltaUnit: 'pp',
          },
        ],
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

  return s;
});
