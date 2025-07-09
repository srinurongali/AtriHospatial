import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { OrganizationService, Organization } from '../../services/organization.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-standard-organization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatSnackBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './standard-organization.component.html',
  styleUrls: ['./standard-organization.component.css']
})
export class StandardOrganizationComponent implements OnInit {
  activeTab = 'list';
  orgForm!: FormGroup;
  displayedColumns: string[] = ['organizationCode', 'organizationType', 'organizationName', 'shortname', 'creditLimit', 'billClearanceDays', 'payMethod', 'actions'];
  organizations: Organization[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  tariffs: any[] = [];
  states: string[] = ['Maharashtra', 'California', 'Ontario', 'New South Wales'];
  contactTypes: string[] = ['Primary', 'Secondary', 'Billing', 'Technical'];
  priorities: string[] = ['1', '2', '3', '4'];
  paymentMethods: string[] = ['Cash', 'Credit Card', 'Bank Transfer', 'Cheque'];
  countries: string[] = ['India', 'USA', 'Canada', 'Australia'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private orgService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
    this.loadTariffs();
    this.orgForm = this.fb.group({
      organizationCode: [''],
      organizationType: [''],
      organizationName: [''],
      shortname: [''],
      creditLimit: [''],
      billClearanceDays: [''],
      payMethod: [''],
      address: [''],
      country: [''],
      state: [''],
      city: [''],
      organizationMobile: [''],
      website: [''],
      contactPersonName: [''],
      designation: [''],
      department: [''],
      email: [''],
      mobNum: [''],
      tariffCode: [''],
      contactType: [''],
      priority: [''],
      tariffName: ['']
    });
  }

  loadTariffs(): void {
    // Replace this mock data with API call if available
    this.tariffs = [
      { tariffCode: 'TARIFF015', tariffName: 'atri' },
      { tariffCode: 'TARIFF016', tariffName: 'vip' },
      { tariffCode: 'TARIFF017', tariffName: 'govt' }
    ];
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  loadOrganizations(): void {
    this.orgService.getAll().subscribe({
      next: (data: Organization[]) => {
        this.organizations = data;
      },
      error: () => {
        this.snackBar.open('⚠️ Failed to load organizations', 'Close', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  get filteredOrganizations(): Organization[] {
    let filtered = this.organizations;
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(org =>
        org.organizationName?.toLowerCase().includes(search) ||
        org.organizationCode?.toLowerCase().includes(search)
      );
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    let filtered = this.organizations;
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(org =>
        org.organizationName?.toLowerCase().includes(search) ||
        org.organizationCode?.toLowerCase().includes(search)
      );
    }
    return Math.ceil(filtered.length / this.itemsPerPage) || 1;
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  onSubmit(): void {
    if (this.orgForm.invalid) {
      this.snackBar.open('⚠️ Please fill in all required fields.', 'Close', { duration: 3000, verticalPosition: 'top' });
      return;
    }

    const formValue = this.orgForm.value;
    const newOrg: Organization = {
      ...formValue,
      statusId: 1,
      createdBy: 'admin'
    };

    this.orgService.save(newOrg).subscribe({
      next: (response) => {
        this.snackBar.open(`✅ Saved! Tariff Name: ${response.tariffName}`, 'Close', { duration: 3000, verticalPosition: 'top' });
        this.orgForm.reset();
        this.setTab('list');
        this.loadOrganizations();
      },
      error: () => {
        this.snackBar.open('❌ Failed to save organization.', 'Close', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  deleteOrg(org: Organization): void {
    if (!org.organizationCode) return;

    const confirmDelete = confirm(`Are you sure you want to delete "${org.organizationName}"?`);
    if (!confirmDelete) return;

    this.orgService.delete(org.organizationCode).subscribe({
      next: () => {
        this.snackBar.open('✅ Organization deleted.', 'Close', { duration: 3000, verticalPosition: 'top' });
        this.loadOrganizations();
      },
      error: () => {
        this.snackBar.open('❌ Failed to delete.', 'Close', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  getPaginationRange(): string {
    const total = this.organizations.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  }

  addContact(): void {
    // TODO: Implement contact addition logic
  }

  addPriority(): void {
    // TODO: Implement priority addition logic
  }

  viewOrg(org: Organization): void {
    // TODO: Implement view logic (e.g., open modal or set form values for viewing)
    this.snackBar.open(`Viewing organization: ${org.organizationName}`, 'Close', { duration: 2000, verticalPosition: 'top' });
  }
}
