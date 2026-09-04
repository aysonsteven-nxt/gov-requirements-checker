import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ApplicantContext } from '../../core/models/applicant-context';
import { GovernmentService } from '../../core/models/government-service';
import { RequirementsCheckerComponent } from './requirements-checker.component';

describe('RequirementsCheckerComponent', () => {
  let component: RequirementsCheckerComponent;
  let fixture: ComponentFixture<RequirementsCheckerComponent>;

  const service: GovernmentService = {
    id: 'test-service',
    name: 'Test Service',
    description: 'Test service description',
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

  const context: ApplicantContext = {
    applicantType: 'adult',
    applicationType: 'new',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementsCheckerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      RequirementsCheckerComponent
    );

    component = fixture.componentInstance;

    fixture.componentRef.setInput('service', service);
    fixture.componentRef.setInput('context', context);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should evaluate requirements on initialization', () => {
    expect(component.result).toBeTruthy();
    expect(component.result?.totalApplicable).toBe(3);
    expect(component.result?.totalSatisfied).toBe(0);
    expect(component.result?.totalMissing).toBe(3);
    expect(component.result?.complete).toBe(false);
  });

  it('should return individual applicable requirements', () => {
    const requirements =
      component.getIndividualRequirements();

    expect(requirements).toHaveLength(2);

    expect(
      requirements.map(
        (evaluation) => evaluation.requirement.id
      )
    ).toEqual([
      'requirement-1',
      'requirement-2',
    ]);
  });

  it('should group alternative requirements', () => {
    const groups = component.getAlternativeGroups();

    expect(groups).toHaveLength(1);
    expect(groups[0].id).toBe('proof-of-identity');
    expect(groups[0].evaluations).toHaveLength(2);

    expect(
      groups[0].evaluations.map(
        (evaluation) => evaluation.requirement.id
      )
    ).toEqual([
      'identity-national-id',
      'identity-drivers-license',
    ]);
  });

  it('should report an alternative group as unsatisfied when no option is satisfied', () => {
    const groups = component.getAlternativeGroups();

    expect(
      component.isAlternativeGroupSatisfied(
        groups[0].evaluations
      )
    ).toBe(false);
  });

  it('should report an alternative group as satisfied when any option is satisfied', () => {
    component.setRequirementStatus(
      'identity-drivers-license',
      'satisfied'
    );

    const groups = component.getAlternativeGroups();

    expect(
      component.isAlternativeGroupSatisfied(
        groups[0].evaluations
      )
    ).toBe(true);
  });

  it('should mark a requirement as satisfied', () => {
    component.setRequirementStatus(
      'requirement-1',
      'satisfied'
    );

    expect(component.result?.totalSatisfied).toBe(1);
    expect(component.result?.totalMissing).toBe(2);
    expect(component.result?.complete).toBe(false);
  });

  it('should mark a requirement as not satisfied', () => {
    component.setRequirementStatus(
      'requirement-1',
      'not-satisfied'
    );

    expect(component.result?.totalSatisfied).toBe(0);
    expect(component.result?.totalMissing).toBe(3);
    expect(component.result?.complete).toBe(false);
  });

  it('should return unanswered for a requirement without a state', () => {
    expect(
      component.getStatus('requirement-1')
    ).toBe('unanswered');
  });

  it('should emit the result when finished', () => {
    const emitSpy = vi.spyOn(
      component.completed,
      'emit'
    );

    component.finish();

    expect(emitSpy).toHaveBeenCalledWith(component.result);
  });
});