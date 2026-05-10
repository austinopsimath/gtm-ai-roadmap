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
      // Initiative Summary: name, description, business rationale, owner, sponsor
      return (
        !!initiative.name.trim() &&
        !!initiative.description.trim() &&
        !!initiative.businessRationale.trim() &&
        !!initiative.initiativeOwner.trim() &&
        !!initiative.executiveSponsor.trim()
      );
    case '2':
      // Prioritization: CARET scored
      return calculatePriorityScore(initiative.caret) !== null;
    case '3':
      // Audiences Served: at least primary audiences set
      return initiative.primaryAudiences.length > 0;
    case '4':
      // GTM Motions: at least one motion selected
      return initiative.gtmMotions.length > 0;
    case '5': {
      // Usage Frequency: primary frequency required if primary audiences exist;
      // secondary required if secondary audiences exist.
      const primaryOk =
        initiative.primaryAudiences.length === 0 ||
        initiative.usageFrequencyPrimary !== null;
      const secondaryOk =
        initiative.secondaryAudiences.length === 0 ||
        initiative.usageFrequencySecondary !== null;
      return primaryOk && secondaryOk && initiative.usageFrequencyPrimary !== null;
    }
    case '6': {
      // Success Metrics: at least one metric defined per level.
      const levelsCovered = new Set<MetricLevel>();
      for (const m of prd.metrics) {
        if (m.name.trim()) levelsCovered.add(m.level);
      }
      return levelsCovered.size === 3;
    }
    case '7':
      // Path: path chosen + (vendor named if Buy) + rationale documented
      return (
        initiative.path !== null &&
        (!isBuy || !!initiative.primaryVendor.trim()) &&
        !!prd.pathRationale.trim()
      );
    case '8':
      // Systems and Integrations
      return initiative.systemsTouched.length > 0;
    case '9':
      // Data Architecture
      return !!prd.dataArchitecture.trim();
    case '10': {
      // Risk Assessment: all applicable risk categories have a disposition.
      const required: (keyof typeof prd.risks)[] = [
        'newUI',
        'overlappingCapabilities',
        'dataQuality',
        'integrationFragility',
      ];
      if (isBuy) required.push('vendorLockIn');
      return required.every((k) => prd.risks[k].disposition !== null);
    }
    case '11': {
      // Pilot Plan: all 7 fields filled in.
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
    case '12':
      // Workstreams: at least one with name + owner + targetDate.
      return prd.workstreams.some(
        (w) => !!w.name.trim() && !!w.owner.trim() && !!w.targetDate,
      );
    case '13':
      // Approval Mechanism
      return !!prd.approvalMechanism.trim();
    case '14':
      // Conditional Compact: yes or conditional yes
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
  for (let i = 1; i <= 14; i++) {
    if (isPRDSectionComplete(initiative, String(i))) count++;
  }
  return count;
}

export const PRD_TOTAL_SECTIONS = 14;
