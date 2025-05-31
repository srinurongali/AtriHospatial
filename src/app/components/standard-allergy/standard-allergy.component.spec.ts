import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardAllergyComponent } from './standard-allergy.component';

describe('StandardAllergyComponent', () => {
  let component: StandardAllergyComponent;
  let fixture: ComponentFixture<StandardAllergyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardAllergyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardAllergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 