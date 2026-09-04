import { Component } from '@angular/core';
import { ApplicantContext } from './core/models/applicant-context';
import { ApplicantQuestionnaireComponent } from './features/applicant-questionnaire.component/applicant-questionnaire.component';
import { GovernmentService } from './core/models/government-service';
import { ServiceSelectionComponent } from './features/service-selection.component/service-selection.component';

@Component({
  selector: 'app-root',
  imports: [ServiceSelectionComponent, ApplicantQuestionnaireComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  applicantContext: ApplicantContext | null = null;
  selectedService: GovernmentService | null = null;

  onServiceSelected(service: GovernmentService): void {
    this.selectedService = service;
  }
  onApplicantContextSubmitted(context: ApplicantContext): void {
    this.applicantContext = context;
  }
}