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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../patient-registration/confirm-dialog.component';

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
  editMode: boolean = false;
  selectedProcedure: Procedure | null = null;

  searchText: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;

  newProcedure = {
    procedureName: '',
    procedureCode: '',
    statusId: 1,
    createdBy: 'admin',
    createdIp: '192.168.1.163',  
    createdOn: new Date()
  };

  // Replace with actual service injection
  constructor(
    private procedureService: ProcedureService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('Procedure Component initialized');
    this.loadProcedures();
  }

  loadProcedures(): void {
    console.log('Loading procedures...');
    this.procedureService.getAll().subscribe((data: Procedure[]) => {
      this.procedures = data;
      console.log('Procedures loaded successfully');
    }, (error) => {
      console.error('Error loading procedures:', error);
      this.procedures = [];
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
    this.activeTabIndex = 1;
    this.newProcedure = {
      procedureName: procedure.procedureName,
      procedureCode: procedure.procedureCode,
      statusId: 1,
      createdBy: 'admin',
      createdIp: '192.168.1.163',
      createdOn: new Date()
    };
  }

  onSubmit(): void {
    if (!this.newProcedure.procedureName || !this.newProcedure.procedureCode) {
      alert('Please fill all required fields.');
      return;
    }
    this.procedureService.save(this.newProcedure).subscribe(() => {
      this.loadProcedures();
      this.snackBar.open('Procedure added successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      // Reset the form fields
      this.newProcedure = {
        procedureName: '',
        procedureCode: '',
        statusId: 1,
        createdBy: 'admin',
        createdIp: '192.168.1.163',
        createdOn: new Date()
      };
    }, (error) => {
      console.error('Error adding procedure:', error);
      this.snackBar.open('Failed to add procedure. Check console for details.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
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
    const total = this.procedures.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  }

  editProcedure(proc: Procedure): void {
    this.newProcedure = {
      procedureName: proc.procedureName,
      procedureCode: proc.procedureCode,
      statusId: 1,
      createdBy: 'admin',
      createdIp: '192.168.1.163',
      createdOn: new Date()
    };
    this.editMode = true;
    this.selectedProcedure = proc;
    this.activeTabIndex = 1;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.selectedProcedure = null;
  }

  deleteProcedure(proc: Procedure): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the ${proc?.procedureName || 'selected'} record?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.procedureService.delete(proc.procedureCode).subscribe(() => {
          this.loadProcedures();
          this.snackBar.open('Procedure deleted successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }, (error) => {
          this.snackBar.open('Failed to delete procedure.', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        });
      }
    });
  }
} 