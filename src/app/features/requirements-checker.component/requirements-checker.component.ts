import {
  Component,
  OnInit,
  input,
  output,
} from '@angular/core';

import { ApplicantContext } from '../../core/models/applicant-context';
import { GovernmentService } from '../../core/models/government-service';
import { RequirementEvaluation } from '../../core/models/requirement-evaluation';
import {
  RequirementState,
  RequirementStatus,
} from '../../core/models/requirement-state';
import { RequirementsEngine } from '../../core/requirements/requirements-engine';
import { RequirementsResult } from '../../core/requirements/requirements-result';

@Component({
  selector: 'app-requirements-checker',
  templateUrl: './requirements-checker.component.html',
  styleUrl: './requirements-checker.component.scss',
})
export class RequirementsCheckerComponent implements OnInit {
  readonly service = input.required<GovernmentService>();

  readonly context = input.required<ApplicantContext>();

  readonly completed = output<RequirementsResult>();

  private readonly engine = new RequirementsEngine();

  states: RequirementState[] = [];

  result: RequirementsResult | null = null;

  ngOnInit(): void {
    this.evaluate();
  }

  evaluate(): void {
    this.result = this.engine.evaluate(
      this.service(),
      this.context(),
      this.states
    );
  }

  setRequirementStatus(
    requirementId: string,
    status: RequirementStatus
  ): void {
    const existingState = this.states.find(
      (state) => state.requirementId === requirementId
    );

    if (existingState) {
      existingState.status = status;
    } else {
      this.states.push({
        requirementId,
        status,
      });
    }

    this.evaluate();
  }

  isSatisfied(requirement: RequirementEvaluation): boolean {
    return requirement.satisfied;
  }

  getStatus(requirementId: string): RequirementStatus {
    return (
      this.states.find(
        (state) => state.requirementId === requirementId
      )?.status ?? 'unanswered'
    );
  }

  finish(): void {
    if (!this.result) {
      this.evaluate();
    }

    if (this.result) {
      this.completed.emit(this.result);
    }
  }
}