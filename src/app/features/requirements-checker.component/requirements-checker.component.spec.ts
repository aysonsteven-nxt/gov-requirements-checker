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
    expect(component.result?.totalApplicable).toBe(1);
    expect(component.result?.totalSatisfied).toBe(0);
    expect(component.result?.totalMissing).toBe(1);
    expect(component.result?.complete).toBe(false);
  });

  it('should evaluate requirements using the provided service and context', () => {
    component.evaluate();

    expect(component.result).toBeTruthy();
    expect(component.result?.totalApplicable).toBe(1);
    expect(component.result?.totalMissing).toBe(1);
    expect(component.result?.complete).toBe(false);
  });

  it('should mark a requirement as satisfied', () => {
    component.evaluate();

    component.setRequirementStatus(
      'requirement-1',
      'satisfied'
    );

    expect(component.result?.totalSatisfied).toBe(1);
    expect(component.result?.totalMissing).toBe(0);
    expect(component.result?.complete).toBe(true);
  });

  it('should mark a requirement as not satisfied', () => {
    component.evaluate();

    component.setRequirementStatus(
      'requirement-1',
      'not-satisfied'
    );

    expect(component.result?.totalSatisfied).toBe(0);
    expect(component.result?.totalMissing).toBe(1);
    expect(component.result?.complete).toBe(false);
  });

  it('should return unanswered for a requirement without a state', () => {
    expect(
      component.getStatus('requirement-1')
    ).toBe('unanswered');
  });

  it('should emit the result when finished', () => {
    const emitSpy = vi.spyOn(component.completed, 'emit');

    component.evaluate();
    component.finish();

    expect(emitSpy).toHaveBeenCalledWith(component.result);
  });
});