import { Requirement } from './requirement';
import { RequirementSource } from './source';

export interface GovernmentService {
  id: string;
  name: string;
  description?: string;
  agency: string;
  category: string;
  requirements: Requirement[];
  source: RequirementSource;
}