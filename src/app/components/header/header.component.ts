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
    this.isSetupsDropdownVisible = false;
    this.router.navigate(['/standard-allergy']);
  }

  navigateToProcedureSetup() {
    this.isSetupsDropdownVisible = false;
    this.router.navigate(['/standard-procedure']);
  }

  navigateToPatientManagement() {
    this.isServicesDropdownVisible = false;
    this.router.navigate(['/patient-registration']);
  }

  navigateToAppointmentScheduling() {
    this.isServicesDropdownVisible = false;
    this.router.navigate(['/appointment-scheduling']);
  }

  navigateToBillingInsurance() {
    this.isServicesDropdownVisible = false;
    this.router.navigate(['/billing-insurance']);
  }

  navigateToReportsAnalytics() {
    this.isServicesDropdownVisible = false;
    this.router.navigate(['/reports-analytics']);
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
