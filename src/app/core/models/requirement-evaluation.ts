import { Requirement } from '../models/requirement';

export interface RequirementEvaluation {
  requirement: Requirement;
  applicable: boolean;
  satisfied: boolean;
}
