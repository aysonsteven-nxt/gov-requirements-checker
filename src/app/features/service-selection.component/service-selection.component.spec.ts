import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { ServiceSelectionComponent } from './service-selection.component';
import { PASSPORT_CONFIG } from '../../config/government-services/passport.config';

describe('ServiceSelectionComponent', () => {
  let component: ServiceSelectionComponent;
  let fixture: ComponentFixture<ServiceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceSelectionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the configured government service', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain(PASSPORT_CONFIG.name);
    expect(element.textContent).toContain(PASSPORT_CONFIG.agency);
  });

  it('should not have a selected service initially', () => {
    expect(component.selectedServiceId).toBeNull();
  });

  it('should select a government service', () => {
    component.selectService(PASSPORT_CONFIG);

    expect(component.selectedServiceId).toBe(
      PASSPORT_CONFIG.id
    );
  });

  it('should emit the selected service when continuing', () => {
    const emitSpy = vi.spyOn(component.serviceSelected, 'emit');

    component.selectService(PASSPORT_CONFIG);
    component.continue();

    expect(emitSpy).toHaveBeenCalledWith(PASSPORT_CONFIG);
  });

  it('should not emit a service when continuing without a selection', () => {
    const emitSpy = vi.spyOn(component.serviceSelected, 'emit');

    component.continue();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});