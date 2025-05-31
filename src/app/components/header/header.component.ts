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

  constructor(private router: Router) {}

  toggleSetupsDropdown() {
    this.isSetupsDropdownVisible = !this.isSetupsDropdownVisible;
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isSetupsDropdownVisible = false;
    }
  }
}
