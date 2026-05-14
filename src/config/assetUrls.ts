import assistCoverUrl from '@/assets/intro/assist-cover.png?url';
import careHeroUrl from '@/assets/intro/care-hero.jpg?url';
import landingPremiumUrl from '@/assets/landing/premium-photo.png?url';
import landingPhotoClinicUrl from '@/assets/landing/photo-clinic.png?url';
import landingImgDashboardUrl from '@/assets/landing/img-dashboard.png?url';
import landingImgReceptionUrl from '@/assets/landing/img-reception.png?url';
import landingImgCorridorUrl from '@/assets/landing/img-corridor.png?url';
import zerodoxPainelUrl from '@/assets/presentation/zerodox-painel-produtividade.png?url';
import analiseGraficosUrl from '@/assets/presentation/analise-graficos.png?url';

/** URL versionada pelo bundler — evita cache agressivo ao substituir ficheiros em `src/assets`. */
export const INTRO_ASSIST_COVER_URL = assistCoverUrl;

export const LANDING_SHOWCASE_URLS = [
  landingPremiumUrl,
  landingPhotoClinicUrl,
  landingImgDashboardUrl,
  landingImgReceptionUrl,
  landingImgCorridorUrl,
] as const;

export interface SidePhoto {
  src: string;
  alt: string;
}

const SIDE_PHOTO_BY_STEP_ID: Record<string, SidePhoto> = {
  cover: { src: assistCoverUrl, alt: 'Capa da apresentação' },
  limit: { src: landingImgCorridorUrl, alt: 'Corredor hospitalar' },
  'why-agents': { src: landingPremiumUrl, alt: 'Ambiente de trabalho clínico' },
  architecture: { src: landingImgDashboardUrl, alt: 'Monitoragem e dados' },
  journey: { src: landingImgReceptionUrl, alt: 'Receção e jornada do paciente' },
  integration: { src: landingPhotoClinicUrl, alt: 'Contexto clínico' },
  governance: { src: careHeroUrl, alt: 'Equipa assistencial' },
  roadmap: { src: zerodoxPainelUrl, alt: 'Painel gestor de produtividade ZeroDox' },
  'tecnologia-que-age': {
    src: analiseGraficosUrl,
    alt: 'Análise de gráficos e indicadores em tempo real',
  },
  closing: { src: landingImgCorridorUrl, alt: 'Continuidade do cuidado' },
};

export function presentationSidePhotoForStep(stepId: string): SidePhoto {
  return SIDE_PHOTO_BY_STEP_ID[stepId] ?? { src: INTRO_ASSIST_COVER_URL, alt: '' };
}
