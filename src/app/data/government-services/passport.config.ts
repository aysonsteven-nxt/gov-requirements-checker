import { GovernmentService } from '../../core/models/government-service';

export const PASSPORT_CONFIG: GovernmentService = {
  id: 'passport',
  name: 'Philippine Passport Application',
  agency: 'Department of Foreign Affairs',
  category: 'Travel and Identification',
  requirements: [],
  source: {
    agency: 'Department of Foreign Affairs',
    title: '',
    url: '',
    lastVerified: ''
  }
};