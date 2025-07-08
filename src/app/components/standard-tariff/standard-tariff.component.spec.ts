import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTariffComponent } from './standard-tariff.component';

describe('StandardTariffComponent', () => {
  let component: StandardTariffComponent;
  let fixture: ComponentFixture<StandardTariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardTariffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
