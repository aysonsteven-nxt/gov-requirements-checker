import { Component, output } from '@angular/core';

import { ApplicantContext } from '../../core/models/applicant-context';

@Component({
  selector: 'app-applicant-questionnaire',
  templateUrl: './applicant-questionnaire.component.html',
  styleUrl: './applicant-questionnaire.component.scss',
})
export class ApplicantQuestionnaireComponent {
  applicantType: ApplicantContext['applicantType'] | null = null;

  applicationType: ApplicantContext['applicationType'] | null = null;

  readonly contextSubmitted = output<ApplicantContext>();

  selectApplicantType(
    applicantType: ApplicantContext['applicantType']
  ): void {
    this.applicantType = applicantType;
  }

  selectApplicationType(
    applicationType: ApplicantContext['applicationType']
  ): void {
    this.applicationType = applicationType;
  }

  continue(): void {
    if (!this.applicantType || !this.applicationType) {
      return;
    }

    this.contextSubmitted.emit({
      applicantType: this.applicantType,
      applicationType: this.applicationType,
    });
  }
}