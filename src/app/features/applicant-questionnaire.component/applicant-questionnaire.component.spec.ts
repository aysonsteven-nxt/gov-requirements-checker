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

import { ApplicantQuestionnaireComponent } from './applicant-questionnaire.component';

describe('ApplicantQuestionnaireComponent', () => {
  let component: ApplicantQuestionnaireComponent;
  let fixture: ComponentFixture<ApplicantQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantQuestionnaireComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ApplicantQuestionnaireComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no answers initially', () => {
    expect(component.applicantType).toBeNull();
    expect(component.applicationType).toBeNull();
  });

  it('should select an applicant type', () => {
    component.selectApplicantType('minor');

    expect(component.applicantType).toBe('minor');
  });

  it('should select an application type', () => {
    component.selectApplicationType('renewal');

    expect(component.applicationType).toBe('renewal');
  });

  it('should not emit when the questionnaire is incomplete', () => {
    const emitSpy = vi.spyOn(
      component.contextSubmitted,
      'emit'
    );

    component.selectApplicantType('adult');
    component.continue();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit the applicant context when complete', () => {
    const emitSpy = vi.spyOn(
      component.contextSubmitted,
      'emit'
    );

    component.selectApplicantType('adult');
    component.selectApplicationType('new');

    component.continue();

    expect(emitSpy).toHaveBeenCalledWith({
      applicantType: 'adult',
      applicationType: 'new',
    });
  });
});