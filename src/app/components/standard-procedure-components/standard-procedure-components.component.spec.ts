import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardProcedureComponentsComponent } from './standard-procedure-components.component';

describe('StandardProcedureComponentsComponent', () => {
  let component: StandardProcedureComponentsComponent;
  let fixture: ComponentFixture<StandardProcedureComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ StandardProcedureComponentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardProcedureComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 