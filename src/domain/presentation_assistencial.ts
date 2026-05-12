import type { PresentationStep } from './types';
import { INTRO_ASSIST_COVER_URL } from '@/config/assetUrls';
import { steps as baseSteps } from './presentation';

export const presentationAssistencialMeta = {
  title: '2 — Assistência',
  subtitle: 'Continuidade do cuidado, contexto clínico e decisão ao longo da jornada',
  author: '',
};

function withContent(id: PresentationStep['id'], patch: Partial<PresentationStep['content']>) {
  return (s: PresentationStep): PresentationStep =>
    s.id === id ? { ...s, content: { ...s.content, ...patch } } : s;
}

function withStep(id: PresentationStep['id'], patch: Partial<PresentationStep>) {
  return (s: PresentationStep): PresentationStep =>
    s.id === id
      ? {
          ...s,
          ...patch,
          content: { ...s.content, ...(patch.content ?? {}) },
        }
      : s;
}

export const assistencialSteps: PresentationStep[] = baseSteps
  .map((s) => ({ ...s, content: { ...s.content } }))
  .map((s) =>
    s.id === 'cover'
      ? {
          ...s,
          title: 'Onde o cuidado perde continuidade na sua operação?',
          subtitle: '2 — Assistência',
        }
      : s,
  )
  .map(
    withStep('limit', {
      title: 'O risco assistencial nem sempre nasce da gravidade do caso.',
      subtitle: 'Contexto clínico ao longo da jornada',
    }),
  )
  .map(
    withStep('why-agents', {
      title: 'A instituição registra o cuidado',
      subtitle: 'Registrar não é o mesmo que sustentar contexto',
    }),
  )
  .map(
    withStep('architecture', {
      title: 'Quando o contexto se perde, o risco cresce em silêncio',
      subtitle: 'Evidência e pontos críticos',
    }),
  )
  .map(
    withStep('journey', {
      title: 'A ruptura não acontece em um único ponto',
      subtitle: 'Ela se forma ao longo da jornada',
    }),
  )
  .map(
    withStep('integration', {
      title: 'O problema não é falta de competência clínica',
      subtitle: 'É ausência de continuidade decisória',
    }),
  )
  .map(
    withStep('governance', {
      title: 'A pergunta deixa de ser onde está registrado',
      subtitle: 'Virada de lógica',
    }),
  )
  .map(
    withStep('roadmap', {
      title: 'Do registro à decisão contínua',
      subtitle: 'Movimento necessário',
    }),
  )
  .map(
    withStep('closing', {
      title: 'Uma base coordenada para o cuidado',
      subtitle: 'Segurança assistencial em escala',
    }),
  )
  .map(
    withContent('cover', {
      headline: 'Abertura',
      body:
        'Na admissão com dados incompletos?\nNa transição entre áreas?\nNo diagnóstico que não acompanha o caso?\nNo centro cirúrgico ou na recuperação?\nNa documentação fragmentada?\nNa alta sem acompanhamento?\nNo pós-alta sem vínculo?',
      heroImage: { src: INTRO_ASSIST_COVER_URL, alt: 'Equipe em corredor hospitalar' },
      meta: {
        Edição: '01 / 2026',
        Tempo: '~12 min',
        Público: 'Liderança assistencial e tecnologia',
      },
    }),
  )
  .map(
    withContent('limit', {
      headline: 'Diagnóstico',
      body:
        'Muitas vezes, ele se forma quando o contexto clínico se perde ao longo da jornada.\n\nNão falta dado. Falta continuidade.',
      meta: {
        Próximo: 'O que a instituição sustenta',
      },
    }),
  )
  .map(
    withContent('why-agents', {
      headline: 'Fragmentação',
      metrics: [],
      body:
        'A instituição registra o cuidado. Mas nem sempre sustenta o contexto.\n\nMas… ao longo da jornada:\n\nA operação sustenta o cuidado todos os dias, mas ainda não sustenta continuidade de decisão.',
      bullets: [
        'Registra',
        'Documenta',
        'Atende',
        'Prescreve',
        'Executa',
        'Encaminha',
        'Dá alta',
        'informações não chegam completas',
        'históricos são reconstruídos',
        'decisões são tomadas com visão parcial',
        'áreas operam com leituras diferentes',
        'o cuidado perde fluidez',
      ],
      bulletSplitAfter: 7,
      meta: {
        Próximo: 'Evidência quantitativa',
      },
    }),
  )
  .map(
    withContent('architecture', {
      headline: 'Evidência',
      architectureMinimal: true,
      body:
        'Quando o contexto se perde, o risco cresce em silêncio.\n\nA transição não é apenas passagem de área. É um ponto crítico de segurança.\nEm áreas críticas, o risco precisa ser acompanhado enquanto ainda pode ser antecipado.',
      metrics: [
        {
          value: 80,
          decimals: 0,
          label: 'Eventos adversos graves',
          suffix: 'associados a falhas nas transições de cuidado',
          ring: 80,
          trend: [52, 58, 61, 64, 68, 72, 76, 80],
          delta: 4,
          deltaUnit: 'pp',
        },
        {
          value: 15,
          decimals: 0,
          label: 'Complicações tardias',
          suffix: 'em áreas críticas (ex.: recuperação pós-anestésica)',
          ring: 15,
          trend: [9, 10, 11, 11.5, 12.5, 13, 14, 15],
          delta: 1,
          deltaUnit: 'pp',
        },
      ],
      bullets: [
        'A transição é ponto crítico de segurança — não apenas “passagem de área”',
        'Em áreas críticas, o risco precisa ser acompanhado enquanto ainda pode ser antecipado',
      ],
      visual: { type: 'risk-curve' },
      meta: {
        Próximo: 'Jornada como cadeia de decisões',
      },
    }),
  )
  .map(
    withContent('journey', {
      headline: 'Jornada',
      journeyStages: [
        'Admissão',
        'Atendimento',
        'Diagnóstico',
        'Transição',
        'Centro cirúrgico',
        'Recuperação',
        'Documentação',
        'Alta',
        'Pós-alta',
      ],
      body:
        'Cada etapa parece resolvida isoladamente.\nMas o cuidado depende de continuidade entre elas.\n\nQuando a jornada depende de reconstrução manual, o risco passa a se formar entre as etapas.\n\nOrientação visual: cada etapa como ponto na jornada; entre os pontos, rupturas de contexto e alertas.',
      bullets: [],
      meta: {
        Próximo: 'Limite do modelo atual',
      },
    }),
  )
  .map(
    withContent('integration', {
      headline: 'Modelo atual',
      integrationMinimal: true,
      body:
        'O limite não está na ausência de tecnologia. Está na ausência de continuidade decisória.',
      bullets: [
        'Reconstrói histórico',
        'Reconstrói contexto',
        'Reconstrói pendências',
        'Reconstrói orientações',
        'Reconstrói riscos',
        'Reconstrói decisões',
        'No curto prazo, a equipe compensa.\nNo médio prazo, isso cria variabilidade.',
      ],
      meta: {
        Próximo: 'Nova pergunta operacional',
      },
    }),
  )
  .map(
    withContent('governance', {
      headline: 'Virada',
      governanceCompare: {
        before: 'Onde a informação está registrada?',
        after: 'O contexto certo acompanha a decisão no momento em que ela acontece?',
      },
      body: 'Movimento visual: da posse do dado para a coincidência entre contexto e decisão.',
      bullets: [],
      meta: {
        Conformidade: 'LGPD · governança clínica',
        Próximo: 'Transformações práticas',
      },
    }),
  )
  .map(
    withContent('roadmap', {
      headline: 'Eixos',
      roadmapTransform: true,
      bullets: [
        'De registro → contexto',
        'De etapa → jornada',
        'De leitura tardia → visibilidade durante a execução',
        'De reação → antecipação',
        'De esforço individual → suporte estruturado à decisão',
      ],
      body:
        'Cuidar com continuidade exige uma base capaz de preservar contexto ao longo da jornada.',
      meta: {
        Próximo: 'Encerramento',
      },
    }),
  )
  .map(
    withContent('closing', {
      headline: 'Síntese',
      body:
        'Isso não se resolve com uma solução isolada.\n\nBase clínica e operacional. Diagnóstico integrado. Centro cirúrgico e áreas críticas. Documentação estruturada. Gestão da força de trabalho. Cuidado conectado. Inteligência em tempo real.\n\nEsses elementos não podem operar como pontos separados. Precisam funcionar como uma base coordenada.\n\nSegurança assistencial depende da capacidade de manter continuidade entre áreas, equipes e momentos do cuidado.',
      bullets: [],
      meta: {
        Próximo: 'Workshop de descoberta · 2 horas',
        Contato: 'salux@beanalytic.com.br',
      },
    }),
  );

export const assistencialStepsById: Record<string, PresentationStep> = Object.fromEntries(
  assistencialSteps.map((s) => [s.id, s]),
);
