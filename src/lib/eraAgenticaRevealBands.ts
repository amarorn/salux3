import type { StepContent } from '@/domain/types';

/** Divide um lead em parágrafos por linha em branco ou quebra simples. */
export function splitLeadParagraphs(lead: string): string[] {
  return lead
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/** Ordem alinhada com `NarrativeStep` (de cima para baixo). */
export function buildNarrativeBandKeys(
  content: StepContent,
  painPoints: boolean,
  useBalloon: boolean,
): string[] {
  const exclusiveCards =
    Boolean(content.valueStagesRevealSequentialCards) &&
    Boolean(content.valueStages?.length) &&
    !content.valueStagesRoad &&
    typeof content.valueStagesRevealChunkSize === 'number' &&
    content.valueStagesRevealChunkSize > 0;

  if (exclusiveCards && content.valueStages?.length) {
    const chunk = content.valueStagesRevealChunkSize!;
    const n = Math.ceil(content.valueStages.length / chunk);
    const keys: string[] = [];
    if (content.valueStagesRevealFirstOnClick) {
      keys.push('valueStagesCardRow');
    }
    for (let i = 0; i < n; i++) keys.push(`valueStagesChunk${i}`);
    if (
      content.newsUrls &&
      content.newsUrls.length > 0 &&
      !content.bannerNewsUrls?.length
    ) {
      keys.push('newsUrls');
    }
    if (content.attentionPhrase) keys.push('attention');
    return keys;
  }

  const keys: string[] = ['title'];
  if (content.body && !painPoints && content.bodyAfterTitle) keys.push('body');
  if (content.metrics && content.metrics.length > 0) keys.push('metrics');
  if (content.lead) {
    if (content.leadByParagraph) {
      const paragraphs = splitLeadParagraphs(content.lead);
      paragraphs.forEach((_, i) => keys.push(`lead${i}`));
    } else {
      keys.push('lead');
    }
  }
  if (content.contrastPair) keys.push('contrastPair');
  if (content.valueStages && content.valueStages.length > 0) {
    const chunk = content.valueStagesRevealChunkSize;
    if (content.valueStagesRoad) {
      content.valueStages.forEach((_, i) => keys.push(`roadStage${i}`));
    } else if (typeof chunk === 'number' && chunk > 0) {
      const n = Math.ceil(content.valueStages.length / chunk);
      for (let i = 0; i < n; i++) keys.push(`valueStagesChunk${i}`);
    } else {
      keys.push('valueStages');
    }
  }
  if (content.evidenceMetrics && content.evidenceMetrics.length > 0) keys.push('evidenceMetrics');
  if (content.dualStages) {
    keys.push('dualStagesPositive');
    keys.push('dualStagesNegative');
  }
  if (content.body && !painPoints && !content.bodyAfterTitle) keys.push('body');
  if (
    content.bullets &&
    content.bullets.length > 0 &&
    typeof content.bulletSplitAfter === 'number' &&
    content.bulletSplitAfter > 0 &&
    content.bullets.length > content.bulletSplitAfter
  ) {
    keys.push('bulletSplit');
  }
  if (painPoints && !useBalloon && content.bullets && content.bullets.length > 0) keys.push('painChips');
  if (useBalloon && content.bullets && content.bullets.length > 0) keys.push('balloonTrigger');
  if (
    !painPoints &&
    content.bullets &&
    content.bullets.length > 0 &&
    !(
      typeof content.bulletSplitAfter === 'number' &&
      content.bulletSplitAfter > 0 &&
      content.bullets.length > content.bulletSplitAfter
    )
  ) {
    keys.push('bullets');
  }
  if (painPoints && content.body) keys.push('painBody');
  if (
    content.beforeAfter &&
    content.beforeAfter.before.length > 0 &&
    content.beforeAfter.before.length === content.beforeAfter.after.length
  ) {
    keys.push('beforeAfter');
  }
  if (
    content.newsUrls &&
    content.newsUrls.length > 0 &&
    !content.bannerNewsUrls?.length
  ) {
    keys.push('newsUrls');
  }
  if (content.attentionPhrase) keys.push('attention');
  if (content.highlightPhrases && content.highlightPhrases.length > 0) keys.push('highlightPhrases');
  if (content.evidenceCard) keys.push('evidenceCard');
  if (content.closingHighlight) keys.push('closingHighlight');
  if (content.closingQuestion) {
    keys.push('closingQuestion');
    keys.push('contactCta');
  }
  if (content.visual?.type === 'risk-curve') keys.push('riskCurve');
  return keys;
}

export function buildCoverBandKeys(content: StepContent): string[] {
  const keys: string[] = ['title'];
  if (content.lead) keys.push('lead');
  if (content.contrastPair) keys.push('contrastPair');
  if (content.body) keys.push('body');
  if (content.attentionPhrase) keys.push('attention');
  return keys;
}

export function buildCapacitiesBandKeys(content: StepContent): string[] {
  const keys: string[] = ['headline'];
  if (content.body) keys.push('body');
  const groups = content.capacityGroups ?? [];
  groups.forEach((g, i) => keys.push(`group:${i}:${g.title}`));
  if (content.productExamples && content.productExamples.length > 0) {
    keys.push('productExamples');
  }
  return keys;
}

export function buildClosingBandKeys(stepContent: StepContent): string[] {
  const keys: string[] = ['headline'];
  if (stepContent.body) keys.push('body');
  if (stepContent.valueStages && stepContent.valueStages.length > 0) keys.push('benefits');
  if (stepContent.attentionPhrase) keys.push('attention');
  if (stepContent.highlightPhrases && stepContent.highlightPhrases.length > 0) keys.push('highlights');
  keys.push('cta');
  if (stepContent.closingHighlight) keys.push('closingHighlight');
  return keys;
}
