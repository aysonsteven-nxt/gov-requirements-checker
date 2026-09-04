import { RequirementCondition } from './requirement-condition';
import { RequirementSource } from './source';

export interface Requirement {
  id: string;
  name: string;
  description?: string;
  required: boolean;

  condition?: RequirementCondition;
  alternativeGroup?: string;

  source: RequirementSource;
}