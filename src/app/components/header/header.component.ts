import { Component, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isSetupsDropdownVisible = false;
  isServicesDropdownVisible = false;

  constructor(private router: Router) {}

  toggleSetupsDropdown() {
    this.isSetupsDropdownVisible = !this.isSetupsDropdownVisible;
    this.isServicesDropdownVisible = false;
  }

  toggleServicesDropdown() {
    this.isServicesDropdownVisible = !this.isServicesDropdownVisible;
    this.isSetupsDropdownVisible = false;
  }

  navigateToAllergySetup() {
    console.log('Navigating to Allergy Setup...');
    this.isSetupsDropdownVisible = false;
    this.router.navigate(['/standard-allergy']).then(
      success => {
        console.log('Navigation successful:', success);
      },
      error => {
        console.error('Navigation failed:', error);
      }
    );
  }

  navigateToProcedureSetup() {
    console.log('Navigating to Procedure Setup...');
    this.isSetupsDropdownVisible = false;
    this.router.navigate(['/standard-procedure']).then(
      success => {
        console.log('Navigation successful:', success);
      },
      error => {
        console.error('Navigation failed:', error);
      }
    );
  }

  // Service navigation methods
  navigateToPatientManagement() {
    console.log('Navigating to Patient Registration...');
    this.isServicesDropdownVisible = false;
    this.router.navigate(['/patient-registration']).then(
      success => {
        console.log('Navigation successful:', success);
      },
      error => {
        console.error('Navigation failed:', error);
      }
    );
  }

  navigateToAppointmentScheduling() {
    console.log('Navigating to Appointment Scheduling...');
    this.isServicesDropdownVisible = false;
    this.router.navigate(['/appointment-scheduling']).then(
      success => {
        console.log('Navigation successful:', success);
      },
      error => {
        console.error('Navigation failed:', error);
      }
    );
  }

  navigateToBillingInsurance() {
    console.log('Navigating to Billing & Insurance...');
    this.isServicesDropdownVisible = false;
    this.router.navigate(['/billing-insurance']).then(
      success => {
        console.log('Navigation successful:', success);
      },
      error => {
        console.error('Navigation failed:', error);
      }
    );
  }

  navigateToReportsAnalytics() {
    console.log('Navigating to Reports & Analytics...');
    this.isServicesDropdownVisible = false;
    this.router.navigate(['/reports-analytics']).then(
      success => {
        console.log('Navigation successful:', success);
      },
      error => {
        console.error('Navigation failed:', error);
      }
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isSetupsDropdownVisible = false;
      this.isServicesDropdownVisible = false;
    }
  }
}
