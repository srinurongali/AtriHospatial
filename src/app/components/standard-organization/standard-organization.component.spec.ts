import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardOrganizationComponent } from './standard-organization.component';

describe('StandardOrganizationComponent', () => {
  let component: StandardOrganizationComponent;
  let fixture: ComponentFixture<StandardOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardOrganizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
