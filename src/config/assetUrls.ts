import assistCoverUrl from "@/assets/intro/assist-cover.png?url";
import careHeroUrl from "@/assets/intro/care-hero.jpg?url";
import landingPremiumUrl from "@/assets/landing/premium-photo.png?url";
import landingPhotoClinicUrl from "@/assets/landing/photo-clinic.png?url";
import landingImgDashboardUrl from "@/assets/landing/trilha-1-slide-4.png?url";
import landingImgCorridorUrl from "@/assets/landing/img-corridor.png?url";
import zerodoxPainelUrl from "@/assets/presentation/zerodox-painel-produtividade.png?url";
import analiseGraficosUrl from "@/assets/presentation/analise-graficos.png?url";
import medicalGroupUrl from "@/assets/presentation/medicalGroup.png?url";
import governancaTrilha5BannerTechUrl from "@/assets/presentation/governanca-trilha5-ai-tech.png?url";

/** URL versionada pelo bundler — evita cache agressivo ao substituir ficheiros em `src/assets`. */
export const INTRO_ASSIST_COVER_URL = assistCoverUrl;

export const LANDING_SHOWCASE_URLS = [
  landingPremiumUrl,
  landingPhotoClinicUrl,
  landingImgDashboardUrl,
  landingImgCorridorUrl,
] as const;

export interface SidePhoto {
  src: string;
  alt: string;
  dimensions?: { width: number; height: number };
}

const SIDE_PHOTO_BY_STEP_ID: Record<string, SidePhoto> = {
  cover: { src: assistCoverUrl, alt: "Capa da apresentação" },
  limit: {
    src: governancaTrilha5BannerTechUrl,
    alt: "IA, dados e operação em saúde",
  },
  "why-agents": { src: landingPremiumUrl, alt: "Ambiente de trabalho clínico" },
  architecture: { src: landingImgDashboardUrl, alt: "Monitoragem e dados" },
  integration: { src: landingPhotoClinicUrl, alt: "Contexto clínico" },
  governance: { src: careHeroUrl, alt: "Equipa assistencial" },
  roadmap: {
    src: zerodoxPainelUrl,
    alt: "Painel gestor de produtividade ZeroDox",
  },
  "tecnologia-que-age": {
    src: analiseGraficosUrl,
    alt: "Análise de gráficos e indicadores em tempo real",
  },
  closing: { src: medicalGroupUrl, alt: "Continuidade do cuidado" },
};

export function presentationSidePhotoForStep(stepId: string): SidePhoto {
  return (
    SIDE_PHOTO_BY_STEP_ID[stepId] ?? { src: INTRO_ASSIST_COVER_URL, alt: "" }
  );
}
