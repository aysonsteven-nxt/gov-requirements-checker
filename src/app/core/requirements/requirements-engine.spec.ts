import { describe, expect, it } from 'vitest';

import { ApplicantContext } from '../models/applicant-context';
import { GovernmentService } from '../models/government-service';
import { RequirementState } from '../models/requirement-state';
import { RequirementsEngine } from './requirements-engine';

describe('RequirementsEngine', () => {
  const adultContext: ApplicantContext = {
    applicantType: 'adult',
    applicationType: 'new',
  };

  const minorContext: ApplicantContext = {
    applicantType: 'minor',
    applicationType: 'new',
  };

  const service: GovernmentService = {
    id: 'test-service',
    name: 'Test Service',
    agency: 'Test Agency',
    category: 'Test',
    requirements: [
      {
        id: 'requirement-1',
        name: 'Requirement 1',
        required: true,
        source: {
          agency: 'Test Agency',
          title: 'Test Source',
          url: 'https://example.com',
          lastVerified: '2026-09-04',
        },
      },
      {
        id: 'requirement-2',
        name: 'Requirement 2',
        required: true,
        source: {
          agency: 'Test Agency',
          title: 'Test Source',
          url: 'https://example.com',
          lastVerified: '2026-09-04',
        },
      },
      {
        id: 'minor-requirement',
        name: 'Minor Requirement',
        required: true,
        condition: {
          field: 'applicantType',
          operator: 'equals',
          value: 'minor',
        },
        source: {
          agency: 'Test Agency',
          title: 'Test Source',
          url: 'https://example.com',
          lastVerified: '2026-09-04',
        },
      },
    ],
    source: {
      agency: 'Test Agency',
      title: 'Test Source',
      url: 'https://example.com',
      lastVerified: '2026-09-04',
    },
  };

  const alternativeService: GovernmentService = {
    id: 'alternative-service',
    name: 'Alternative Service',
    agency: 'Test Agency',
    category: 'Test',
    requirements: [
      {
        id: 'identity-national-id',
        name: 'National ID',
        required: true,
        alternativeGroup: 'proof-of-identity',
        source: {
          agency: 'Test Agency',
          title: 'Test Source',
          url: 'https://example.com',
          lastVerified: '2026-09-04',
        },
      },
      {
        id: 'identity-drivers-license',
        name: "Driver's License",
        required: true,
        alternativeGroup: 'proof-of-identity',
        source: {
          agency: 'Test Agency',
          title: 'Test Source',
          url: 'https://example.com',
          lastVerified: '2026-09-04',
        },
      },
      {
        id: 'identity-passport',
        name: 'Existing Passport',
        required: true,
        alternativeGroup: 'proof-of-identity',
        source: {
          agency: 'Test Agency',
          title: 'Test Source',
          url: 'https://example.com',
          lastVerified: '2026-09-04',
        },
      },
    ],
    source: {
      agency: 'Test Agency',
      title: 'Test Source',
      url: 'https://example.com',
      lastVerified: '2026-09-04',
    },
  };

  const engine = new RequirementsEngine();

  it('should mark all requirements as satisfied when all applicable requirements are satisfied', () => {
    const states: RequirementState[] = [
      {
        requirementId: 'requirement-1',
        status: 'satisfied',
      },
      {
        requirementId: 'requirement-2',
        status: 'satisfied',
      },
    ];

    const result = engine.evaluate(service, adultContext, states);

    expect(result.totalApplicable).toBe(2);
    expect(result.totalSatisfied).toBe(2);
    expect(result.totalMissing).toBe(0);
    expect(result.complete).toBe(true);
  });

  it('should mark a requirement as missing when it is not satisfied', () => {
    const states: RequirementState[] = [
      {
        requirementId: 'requirement-1',
        status: 'satisfied',
      },
      {
        requirementId: 'requirement-2',
        status: 'not-satisfied',
      },
    ];

    const result = engine.evaluate(service, adultContext, states);

    expect(result.totalApplicable).toBe(2);
    expect(result.totalSatisfied).toBe(1);
    expect(result.totalMissing).toBe(1);
    expect(result.complete).toBe(false);
  });

  it('should treat an unanswered requirement as not satisfied', () => {
    const states: RequirementState[] = [
      {
        requirementId: 'requirement-1',
        status: 'satisfied',
      },
    ];

    const result = engine.evaluate(service, adultContext, states);

    expect(result.totalApplicable).toBe(2);
    expect(result.totalSatisfied).toBe(1);
    expect(result.totalMissing).toBe(1);
    expect(result.complete).toBe(false);
  });

  it('should exclude requirements whose condition does not apply', () => {
    const states: RequirementState[] = [
      {
        requirementId: 'requirement-1',
        status: 'satisfied',
      },
      {
        requirementId: 'requirement-2',
        status: 'satisfied',
      },
    ];

    const result = engine.evaluate(service, adultContext, states);

    const evaluation = result.evaluations.find(
      (evaluation) =>
        evaluation.requirement.id === 'minor-requirement'
    );

    expect(evaluation?.applicable).toBe(false);
    expect(evaluation?.satisfied).toBe(false);

    expect(result.totalApplicable).toBe(2);
    expect(result.totalSatisfied).toBe(2);
    expect(result.totalMissing).toBe(0);
    expect(result.complete).toBe(true);
  });

  it('should include requirements whose condition applies', () => {
    const states: RequirementState[] = [
      {
        requirementId: 'requirement-1',
        status: 'satisfied',
      },
      {
        requirementId: 'requirement-2',
        status: 'satisfied',
      },
    ];

    const result = engine.evaluate(service, minorContext, states);

    const evaluation = result.evaluations.find(
      (evaluation) =>
        evaluation.requirement.id === 'minor-requirement'
    );

    expect(evaluation?.applicable).toBe(true);
    expect(evaluation?.satisfied).toBe(false);

    expect(result.totalApplicable).toBe(3);
    expect(result.totalSatisfied).toBe(2);
    expect(result.totalMissing).toBe(1);
    expect(result.complete).toBe(false);
  });

  it('should treat alternative requirements as a single requirement group', () => {
    const states: RequirementState[] = [];

    const result = engine.evaluate(
      alternativeService,
      adultContext,
      states
    );

    expect(result.totalApplicable).toBe(1);
    expect(result.totalSatisfied).toBe(0);
    expect(result.totalMissing).toBe(1);
    expect(result.complete).toBe(false);
  });

  it('should satisfy an alternative requirement group when any option is satisfied', () => {
    const states: RequirementState[] = [
      {
        requirementId: 'identity-drivers-license',
        status: 'satisfied',
      },
    ];

    const result = engine.evaluate(
      alternativeService,
      adultContext,
      states
    );

    expect(result.totalApplicable).toBe(1);
    expect(result.totalSatisfied).toBe(1);
    expect(result.totalMissing).toBe(0);
    expect(result.complete).toBe(true);
  });

  it('should keep an alternative requirement group missing when none of its options are satisfied', () => {
    const states: RequirementState[] = [
      {
        requirementId: 'identity-national-id',
        status: 'not-satisfied',
      },
      {
        requirementId: 'identity-drivers-license',
        status: 'not-satisfied',
      },
    ];

    const result = engine.evaluate(
      alternativeService,
      adultContext,
      states
    );

    expect(result.totalApplicable).toBe(1);
    expect(result.totalSatisfied).toBe(0);
    expect(result.totalMissing).toBe(1);
    expect(result.complete).toBe(false);
  });
});