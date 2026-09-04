import { Component, output } from '@angular/core';

import { GovernmentService } from '../../core/models/government-service';
import { PASSPORT_CONFIG } from '../../config/government-services/passport.config';

@Component({
  selector: 'app-service-selection',
  templateUrl: './service-selection.component.html',
  styleUrl: './service-selection.component.scss',
})
export class ServiceSelectionComponent {
  readonly services: GovernmentService[] = [PASSPORT_CONFIG];

  selectedServiceId: string | null = null;

  readonly serviceSelected = output<GovernmentService>();

  selectService(service: GovernmentService): void {
    this.selectedServiceId = service.id;
  }

  continue(): void {
    if (!this.selectedServiceId) {
      return;
    }

    const selectedService = this.services.find(
      (service) => service.id === this.selectedServiceId
    );

    if (!selectedService) {
      return;
    }

    this.serviceSelected.emit(selectedService);
  }
}