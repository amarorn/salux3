import type { PresentationStep } from './types';
import { steps as baseSteps } from './presentation';

export const presentationGestaoMeta = {
  title: 'Gestão da operação em saúde',
  subtitle: 'Decisão com contexto, custo invisível sob controle',
  author: '',
};

function cloneSteps(steps: PresentationStep[]): PresentationStep[] {
  return steps.map((s) => ({
    ...s,
    content: { ...s.content },
  }));
}

/** Trilha Gestão: substitui os KPIs herdados (receita) por indicadores
 *  de gestão — custo invisível, decisão tardia, lead-time de informação. */
export const gestaoSteps: PresentationStep[] = cloneSteps(baseSteps).map((s) => {
  if (s.id === 'cover') {
    return {
      ...s,
      title: 'GESTÃO DA OPERAÇÃO EM SAÚDE',
      subtitle: 'Decisão com contexto, custo invisível sob controle',
      content: {
        body:
          'Onde a gestão da sua operação perde controle hoje?\nNo custo que ninguém viu chegar?\nNa decisão tomada com visão parcial?\nNo tempo que a informação leva para virar ação?',
        meta: {
          Edição: '01 / 2026',
          Tempo: '~12 min',
          Público: 'Diretoria executiva e financeira',
        },
      },
    };
  }

  if (s.id === 'limit') {
    return {
      ...s,
      title: 'DIAGNÓSTICO',
      subtitle: 'Onde a gestão perde tração',
      content: {
        metrics: [
          {
            value: 71,
            decimals: 0,
            label: 'Decisão com visão parcial',
            suffix: 'das decisões executivas são tomadas sem o contexto completo',
            ring: 71,
            trend: [58, 60, 63, 65, 67, 68, 70, 71],
            delta: 4,
            deltaUnit: 'pp',
          },
          {
            value: 4.2,
            decimals: 1,
            label: 'Lead-time da informação',
            suffix: 'em média até a informação consolidada chegar à decisão',
            ring: 70, // proporcional para representação visual
            trend: [2.8, 3.0, 3.2, 3.5, 3.7, 3.9, 4.0, 4.2],
            delta: 0.6,
            deltaUnit: 'd',
            unit: ' d',
          },
        ],
        body:
          'Isso não é falta de dado.\nÉ falta de continuidade entre dado, contexto e decisão.\n\nO custo invisível não aparece no relatório do mês —\nele aparece no resultado do trimestre.',
      },
    };
  }

  if (s.id === 'why-agents') {
    return {
      ...s,
      title: 'CUSTO INVISÍVEL',
      subtitle: 'O que não é medido continua crescendo',
      content: {
        body:
          'A gestão atual reage ao desvio quando ele já se materializou.\n\nMas grande parte do custo de operar saúde não está no que é registrado —\nestá no retrabalho, no contexto perdido, na decisão tardia.\n\nÉ valor que se dissipa antes de ser percebido.',
        bullets: [
          'Retrabalho em áreas críticas',
          'Decisão fora do contexto',
          'Informação que chega tarde',
          'Reunião de alinhamento como gargalo',
          'Indicadores reativos ao desvio',
        ],
      },
    };
  }

  return s;
});
