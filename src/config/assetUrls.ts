import careHeroUrl from "@/assets/intro/care-hero.jpg?url";
import landingPremiumUrl from "@/assets/landing/premium-photo.png?url";
import landingPhotoClinicUrl from "@/assets/landing/photo-clinic.png?url";
import landingImgDashboardUrl from "@/assets/landing/trilha-1-slide-4.png?url";
import landingImgCorridorUrl from "@/assets/landing/img-corridor.png?url";
import zerodoxPainelUrl from "@/assets/presentation/zerodox-painel-produtividade.png?url";
import governancaTrilha5BannerTechUrl from "@/assets/presentation/governanca-trilha5-ai-tech.png?url";

/** Fallback de banner quando o slide não define foto própria. */
export const INTRO_ASSIST_COVER_URL = "/intro/TELA_INICIAL_INITIA.png";

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
};

export function presentationSidePhotoForStep(stepId: string): SidePhoto | null {
  const preset = SIDE_PHOTO_BY_STEP_ID[stepId];
  if (preset) return preset;
  if (stepId === "cover" || stepId === "closing") return null;
  return { src: INTRO_ASSIST_COVER_URL, alt: "Tela inicial INITIA" };
}
