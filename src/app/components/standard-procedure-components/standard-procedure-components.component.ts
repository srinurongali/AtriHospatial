import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

import { ProcedureService, Procedure } from '../../services/procedure.service';

@Component({
  selector: 'app-standard-procedure-components',
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
  templateUrl: './standard-procedure-components.component.html',
  styleUrls: ['./standard-procedure-components.component.css']
})
export class StandardProcedureComponentsComponent implements OnInit {
  activeTabIndex = 0;
  displayedColumns: string[] = ['name', 'code', 'actions'];

  procedures: Procedure[] = [];

  searchText: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;

  newProcedure = {
    procedureName: '',
    procedureCode: '',
    statusId: 1,
    addedBy: 'admin',
    addedIp: '192.168.1.163',  
    addedOn: new Date()
  };

  // Replace with actual service injection
  constructor(private procedureService: ProcedureService) { }

  ngOnInit(): void {
    console.log('Procedure Component initialized');
    this.loadProcedures();
  }

  loadProcedures(): void {
    console.log('Loading procedures...');
    this.procedureService.getProcedures().pipe(
      tap(data => {
        console.log('Raw procedures data received:', JSON.stringify(data, null, 2));
        this.procedures = data.map((item: any) => ({
          procedureName: item.procedureName || item.name || item.procedure_name || '',
          procedureCode: item.procedureCode || item.code || item.procedure_code || '',
          procedureId: item.procedureId || item.id || item.procedure_id,
          statusId: item.statusId,
          addedBy: item.addedBy || item.added_by,
          addedIp: item.addedIp || item.added_ip,
          addedOn: item.addedOn || item.added_on ? new Date(item.addedOn || item.added_on) : undefined
        }));
        console.log('Normalized procedures:', JSON.stringify(this.procedures, null, 2));
        console.log('Procedures array length:', this.procedures.length);
      })
    ).subscribe({
      next: () => {
        console.log('Procedures loaded successfully');
      },
      error: (error) => {
        console.error('Error loading procedures:', error);
        this.procedures = [];
      }
    });
  }

  get pagedProcedures(): Procedure[] {
    console.log('Calculating paged procedures. Current procedures:', JSON.stringify(this.procedures, null, 2));
    const filtered = this.procedures.filter(procedure => {
      const nameMatch = (procedure?.procedureName || '').toLowerCase().includes(this.searchText.toLowerCase());
      const codeMatch = (procedure?.procedureCode || '').toLowerCase().includes(this.searchText.toLowerCase());
      const matches = nameMatch || codeMatch;
      console.log('Filtering procedure:', JSON.stringify(procedure, null, 2), 'Matches:', matches);
      return matches;
    });
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const result = filtered.slice(start, start + this.itemsPerPage);
    console.log('Final paged procedures:', JSON.stringify(result, null, 2));
    return result;
  }

  get totalPages(): number {
    return Math.ceil(
      this.procedures.filter(procedure =>
        (procedure?.procedureName || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (procedure?.procedureCode || '').toLowerCase().includes(this.searchText.toLowerCase())
      ).length / this.itemsPerPage
    );
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  viewProcedure(procedure: Procedure): void {
    alert(`Viewing: ${JSON.stringify(procedure, null, 2)}`);
  }

  deleteProcedure(procedure: Procedure): void {
    const confirmed = confirm(`Delete procedure "${procedure?.procedureName || 'N/A'}"?`);
    if (confirmed) {
      const identifier = procedure?.procedureId || procedure?.procedureCode;
      if (identifier) {
        this.procedureService.deleteProcedure(identifier).subscribe({
          next: () => {
            console.log('Procedure deleted successfully:', JSON.stringify(procedure, null, 2));
            this.loadProcedures();
          },
          error: (error) => {
            console.error('Error deleting procedure:', error);
            alert('Failed to delete procedure. Check console for details.');
          }
        });
      } else {
        console.error('Procedure has no valid identifier (procedureId or procedureCode) for deletion:', JSON.stringify(procedure, null, 2));
        alert('Cannot delete procedure: Missing identifier.');
      }
    }
  }

  onSubmit(): void {
    console.log('Submitting new procedure:', JSON.stringify(this.newProcedure, null, 2));
    if (this.newProcedure.procedureName && this.newProcedure.procedureCode) {
      this.procedureService.addProcedure(this.newProcedure as Procedure).subscribe({
        next: (addedProcedure) => {
          console.log('Procedure added successfully:', JSON.stringify(addedProcedure, null, 2));
          this.loadProcedures();
          this.newProcedure = {
              procedureName: '',
              procedureCode: '',
              statusId: 1,
              addedBy: 'admin',
              addedIp: '192.168.1.163',
              addedOn: new Date()
          };
          this.activeTabIndex = 0;
        },
        error: (error) => {
          console.error('Error adding procedure:', error);
          alert('Failed to add procedure. Check console for details.');
        }
      });
    } else {
      console.log('Form validation failed. Required fields missing.');
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