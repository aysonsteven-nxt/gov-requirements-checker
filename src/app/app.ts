import { Component } from '@angular/core';

import { GovernmentService } from './core/models/government-service';
import { ServiceSelectionComponent } from './features/service-selection.component/service-selection.component';

@Component({
  selector: 'app-root',
  imports: [ServiceSelectionComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  selectedService: GovernmentService | null = null;

  onServiceSelected(service: GovernmentService): void {
    this.selectedService = service;
  }
}