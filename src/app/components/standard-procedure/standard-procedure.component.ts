import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-standard-procedure',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule
  ],
  templateUrl: './standard-procedure.component.html',
  styleUrls: ['./standard-procedure.component.css']
})
export class StandardProcedureComponent {
  activeTabIndex = 0;
  displayedColumns: string[] = ['name', 'code', 'category', 'actions'];

  procedures: any[] = [
    { name: 'Blood Test', code: 'BLD', category: 'Laboratory' },
    { name: 'X-Ray', code: 'XRY', category: 'Imaging' },
    { name: 'Physical Exam', code: 'PEX', category: 'Examination' }
  ];

  searchText: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;

  newProcedure = { name: '', code: '', category: '' };

  get pagedProcedures(): any[] {
    const filtered = this.procedures.filter(procedure =>
      procedure.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      procedure.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
      procedure.category.toLowerCase().includes(this.searchText.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(
      this.procedures.filter(procedure =>
        procedure.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        procedure.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
        procedure.category.toLowerCase().includes(this.searchText.toLowerCase())
      ).length / this.itemsPerPage
    );
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  viewProcedure(procedure: any): void {
    alert(`Viewing: ${JSON.stringify(procedure)}`);
  }

  deleteProcedure(procedure: any): void {
    const confirmed = confirm(`Delete procedure "${procedure.name}"?`);
    if (confirmed) {
      this.procedures = this.procedures.filter(p => p !== procedure);
    }
  }

  onSubmit(): void {
    if (this.newProcedure.name && this.newProcedure.code && this.newProcedure.category) {
      this.procedures.push({ ...this.newProcedure });
      this.newProcedure = { name: '', code: '', category: '' };
      this.activeTabIndex = 0;
    }
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
    const total = this.procedures.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  }
} 