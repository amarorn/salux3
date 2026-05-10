import type { PresentationStep } from './types';
import { presentationMeta as baseMeta, steps as baseSteps } from './presentation';
import { assistencialSteps, presentationAssistencialMeta } from './presentation_assistencial';
import { presentationReceitaMeta, receitaSteps } from './presentation_receita';

export type TrackId = 'era-agentica' | 'operacoes' | 'assistencial' | 'dados' | 'governanca';

export interface TrackMeta {
  title: string;
  subtitle: string;
  author: string;
}

export interface TrackPresentation {
  id: TrackId;
  meta: TrackMeta;
  steps: PresentationStep[];
  stepsById: Record<string, PresentationStep>;
}

function buildStepsById(steps: PresentationStep[]) {
  return Object.fromEntries(steps.map((s) => [s.id, s])) as Record<string, PresentationStep>;
}

function makeTrack(id: TrackId, meta: TrackMeta, steps: PresentationStep[]): TrackPresentation {
  return { id, meta, steps, stepsById: buildStepsById(steps) };
}

const sharedSteps = baseSteps;

export const tracks: TrackPresentation[] = [
  makeTrack(
    'era-agentica',
    {
      title: 'Receita',
      subtitle: presentationReceitaMeta.subtitle,
      author: presentationReceitaMeta.author,
    },
    receitaSteps,
  ),
  makeTrack(
    'operacoes',
    {
      title: presentationAssistencialMeta.title,
      subtitle: presentationAssistencialMeta.subtitle,
      author: presentationAssistencialMeta.author,
    },
    assistencialSteps,
  ),
  makeTrack(
    'assistencial',
    {
      title: 'Operação',
      subtitle: 'Agentes como camada de cuidado contínuo e experiência',
      author: baseMeta.author,
    },
    sharedSteps,
  ),
  makeTrack(
    'dados',
    {
      title: 'Gestão',
      subtitle: 'Ferramentas, eventos e semântica para agentes em saúde',
      author: baseMeta.author,
    },
    sharedSteps,
  ),
  makeTrack(
    'governanca',
    {
      title: 'IA agêntica',
      subtitle: 'Políticas, auditoria e LGPD para autonomia verificável',
      author: baseMeta.author,
    },
    sharedSteps,
  ),
];

export const tracksById: Record<TrackId, TrackPresentation> = Object.fromEntries(
  tracks.map((t) => [t.id, t]),
) as Record<TrackId, TrackPresentation>;

