import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { RequirementsCheckerComponent } from './requirements-checker.component';

describe('RequirementsCheckerComponent', () => {
  let component: RequirementsCheckerComponent;
  let fixture: ComponentFixture<RequirementsCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementsCheckerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequirementsCheckerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});