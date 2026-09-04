export type RequirementStatus =
  | 'unanswered'
  | 'satisfied'
  | 'not-satisfied';

export interface RequirementState {
  requirementId: string;
  status: RequirementStatus;
}