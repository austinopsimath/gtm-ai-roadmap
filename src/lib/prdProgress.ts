import { calculatePriorityScore, type Initiative, type MetricLevel } from '../types';

/**
 * Determines whether a given PRD section is "complete enough" to auto-check on
 * the lifecycle checklist and the section nav. The bar is intentionally
 * forgiving: minimum required content rather than perfect completeness.
 */
export function isPRDSectionComplete(
  initiative: Initiative,
  sectionId: string,
): boolean {
  const prd = initiative.prd;
  const isBuy = initiative.path === 'buy';

  switch (sectionId) {
    case '1':
      return (
        !!initiative.name.trim() &&
        !!initiative.description.trim() &&
        !!initiative.initiativeOwner.trim() &&
        !!initiative.executiveSponsor.trim()
      );
    case '2':
      return initiative.audiencesServed.length > 0;
    case '3':
      return (
        calculatePriorityScore(initiative.caret) !== null &&
        !!initiative.level3Metric.trim()
      );
    case '4': {
      // At least one metric defined with a name at each of the three levels.
      const levelsCovered = new Set<MetricLevel>();
      for (const m of prd.metrics) {
        if (m.name.trim()) levelsCovered.add(m.level);
      }
      return levelsCovered.size === 3;
    }
    case '5':
      return (
        initiative.path !== null &&
        (!isBuy || !!initiative.primaryVendor.trim()) &&
        !!prd.pathRationale.trim()
      );
    case '6':
      return initiative.systemsTouched.length > 0;
    case '7':
      return !!prd.dataArchitecture.trim();
    case '8': {
      // All applicable risk categories have a disposition.
      const required: (keyof typeof prd.risks)[] = [
        'newUI',
        'overlappingCapabilities',
        'dataQuality',
        'integrationFragility',
      ];
      if (isBuy) required.push('vendorLockIn');
      return required.every((k) => prd.risks[k].disposition !== null);
    }
    case '9': {
      const pp = prd.pilotPlan;
      return (
        !!pp.cohortDescription.trim() &&
        !!pp.cohortRationale.trim() &&
        !!pp.timeline.trim() &&
        !!pp.interventionDesign.trim() &&
        !!pp.scaleDecision.trim() &&
        !!pp.fixDecision.trim() &&
        !!pp.killDecision.trim()
      );
    }
    case '10': {
      // At least one workstream with name + owner + targetDate.
      return prd.workstreams.some(
        (w) => !!w.name.trim() && !!w.owner.trim() && !!w.targetDate,
      );
    }
    case '11':
      // Section 11 mirrors Section 4's cadence column — same completeness bar.
      return isPRDSectionComplete(initiative, '4');
    case '12':
      return !!prd.approvalMechanism.trim();
    case '13':
      return (
        prd.compact.conditionalStatus === 'yes' ||
        prd.compact.conditionalStatus === 'conditional_yes'
      );
    default:
      return false;
  }
}

export function prdSectionsComplete(initiative: Initiative): number {
  let count = 0;
  for (let i = 1; i <= 13; i++) {
    if (isPRDSectionComplete(initiative, String(i))) count++;
  }
  return count;
}
