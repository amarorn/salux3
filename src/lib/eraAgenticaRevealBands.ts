import type { StepContent } from '@/domain/types';

/** Ordem alinhada com `NarrativeStep` (de cima para baixo). */
export function buildNarrativeBandKeys(
  content: StepContent,
  painPoints: boolean,
  useBalloon: boolean,
): string[] {
  const keys: string[] = ['title'];
  if (content.metrics && content.metrics.length > 0) keys.push('metrics');
  if (content.lead) keys.push('lead');
  if (content.contrastPair) keys.push('contrastPair');
  if (content.valueStages && content.valueStages.length > 0) {
    const chunk = content.valueStagesRevealChunkSize;
    if (typeof chunk === 'number' && chunk > 0) {
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
  if (content.body && !painPoints) keys.push('body');
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
  if (content.attentionPhrase) keys.push('attention');
  if (content.highlightPhrases && content.highlightPhrases.length > 0) keys.push('highlightPhrases');
  if (content.evidenceCard) keys.push('evidenceCard');
  if (content.closingHighlight) keys.push('closingHighlight');
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
