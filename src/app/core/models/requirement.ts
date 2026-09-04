import { RequirementSource } from './source';

export interface Requirement {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  source: RequirementSource;
}