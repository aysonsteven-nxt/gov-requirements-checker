import { ApplicantContext } from '../models/applicant-context';
import { GovernmentService } from '../models/government-service';
import { RequirementCondition } from '../models/requirement-condition';
import { RequirementEvaluation } from '../models/requirement-evaluation';
import { RequirementState } from '../models/requirement-state';
import { RequirementsResult } from './requirements-result';

export class RequirementsEngine {
  evaluate(
    service: GovernmentService,
    context: ApplicantContext,
    states: RequirementState[]
  ): RequirementsResult {
    const evaluations: RequirementEvaluation[] = service.requirements.map(
      (requirement) => {
        const applicable =
          requirement.required &&
          this.isConditionSatisfied(requirement.condition, context);

        const state = states.find(
          (state) => state.requirementId === requirement.id
        );

        return {
          requirement,
          applicable,
          satisfied: applicable && state?.status === 'satisfied',
        };
      }
    );

    const totalApplicable = this.countApplicable(evaluations);
    const totalSatisfied = this.countSatisfied(evaluations);
    const totalMissing = totalApplicable - totalSatisfied;

    return {
      evaluations,
      totalApplicable,
      totalSatisfied,
      totalMissing,
      complete: totalMissing === 0,
    };
  }

  private isConditionSatisfied(
    condition: RequirementCondition | undefined,
    context: ApplicantContext
  ): boolean {
    if (!condition) {
      return true;
    }

    const actualValue = context[condition.field];

    switch (condition.operator) {
      case 'equals':
        return actualValue === condition.value;

      case 'notEquals':
        return actualValue !== condition.value;
    }
  }

  private countApplicable(
    evaluations: RequirementEvaluation[]
  ): number {
    const alternativeGroups = new Set<string>();
    let count = 0;

    for (const evaluation of evaluations) {
      if (!evaluation.applicable) {
        continue;
      }

      const group = evaluation.requirement.alternativeGroup;

      if (group) {
        alternativeGroups.add(group);
      } else {
        count++;
      }
    }

    return count + alternativeGroups.size;
  }

  private countSatisfied(
    evaluations: RequirementEvaluation[]
  ): number {
    const satisfiedAlternativeGroups = new Set<string>();
    let count = 0;

    for (const evaluation of evaluations) {
      if (!evaluation.applicable) {
        continue;
      }

      const group = evaluation.requirement.alternativeGroup;

      if (group) {
        if (evaluation.satisfied) {
          satisfiedAlternativeGroups.add(group);
        }
      } else if (evaluation.satisfied) {
        count++;
      }
    }

    return count + satisfiedAlternativeGroups.size;
  }
}