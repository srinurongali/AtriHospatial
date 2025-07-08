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
    ReactiveFormsModule
  ],
  templateUrl: './standard-organization.component.html',
  styleUrls: ['./standard-organization.component.css']
})
export class StandardOrganizationComponent implements OnInit {
  activeTab: string = 'list';
  orgForm!: FormGroup;
  displayedColumns: string[] = [
    'organizationCode', 'organizationType', 'organizationName', 'shortname', 'creditLimit', 'billClearanceDays', 'payMethod', 'actions'
  ];
  organizations: Organization[] = [];

  searchText: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;

  isEditMode: boolean = false;
  priorities: string[] = ["1","2","3","4"];
  paymentMethods: string[] = ['Cash', 'Credit Card', 'Insurance', 'Bank Transfer'];
  countries: string[] = ['India', 'USA', 'Canada', 'Australia'];
  states: string[] = ['Maharashtra', 'California', 'Ontario', 'New South Wales'];
  contactTypes: string[] = ['Primary', 'Secondary', 'Billing', 'Technical'];
  orgTypes: string[] = [];

  viewOrg(org: Organization): void {
    // TODO: Implement view logic
  }

  addContact(): void {
    // TODO: Implement contact addition logic
  }

  addPriority(): void {
    // TODO: Implement priority addition logic
  }

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private orgService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
    this.orgForm = this.fb.group({
      organizationCode: ['', Validators.required],
      organizationType: ['', Validators.required],
      organizationName: ['', Validators.required],
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
      contactType: [''],
      tariffCode: [''],
      priority: [''],
      tariffName: ['']
    });
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
        this.snackBar.open('⚠️ Failed to load organizations', 'Close', { duration: 3000 });
      }
    });
  }

  get pagedOrganizations(): Organization[] {
    const filtered = this.organizations.filter(org =>
      org.organizationName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      org.organizationCode?.toLowerCase().includes(this.searchText.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    const totalFiltered = this.organizations.filter(org =>
      org.organizationName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      org.organizationCode?.toLowerCase().includes(this.searchText.toLowerCase())
    ).length;
    return Math.ceil(totalFiltered / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  onSubmit(): void {
    if (this.orgForm.invalid) {
      this.snackBar.open('⚠️ Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.orgForm.value;
    const newOrg: Organization = {
      ...formValue,
      statusId: 1, // default active status
      createdBy: 'admin', // set dynamically in backend or via login user
      createdIp: '127.0.0.1' // optional; real value added by backend
    };

    this.orgService.save(newOrg).subscribe({
      next: () => {
        this.snackBar.open('✅ Organization added successfully!', 'Close', { duration: 3000 });
        this.orgForm.reset();
        this.setTab('list');
        this.loadOrganizations();
      },
      error: () => {
        this.snackBar.open('❌ Failed to add organization.', 'Close', { duration: 3000 });
      }
    });
  }

  deleteOrg(org: Organization): void {
    if (!org.organizationCode) return;

    const confirmDelete = confirm(`Are you sure you want to delete "${org.organizationName}"?`);
    if (!confirmDelete) return;

    this.orgService.delete(org.organizationCode).subscribe({
      next: () => {
        this.snackBar.open('✅ Organization deleted.', 'Close', { duration: 3000 });
        this.loadOrganizations();
      },
      error: () => {
        this.snackBar.open('❌ Failed to delete.', 'Close', { duration: 3000 });
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
}
