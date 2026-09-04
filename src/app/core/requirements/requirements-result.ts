import { RequirementEvaluation } from "../models/requirement-evaluation";

export interface RequirementsResult {
  evaluations: RequirementEvaluation[];

  totalApplicable: number;
  totalSatisfied: number;
  totalMissing: number;

  complete: boolean;
}