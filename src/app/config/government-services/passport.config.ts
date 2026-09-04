import { GovernmentService } from '../../core/models/government-service';

export const PASSPORT_CONFIG: GovernmentService = {
  id: 'passport-new-application',
  name: 'Philippine Passport — New Application',
  description: 'Application for a new Philippine passport.',
  agency: 'Department of Foreign Affairs',
  category: 'Travel and Identification',

  requirements: [],

  source: {
    agency: 'Department of Foreign Affairs',
    title: 'Passport Requirements',
    url: 'https://www.passport.gov.ph/',
    lastVerified: '2026-09-04'
  }
};