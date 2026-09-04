import { ApplicantContext } from './applicant-context';

export interface RequirementCondition {
  field: keyof ApplicantContext;
  operator: 'equals' | 'notEquals';
  value: string | boolean;
}