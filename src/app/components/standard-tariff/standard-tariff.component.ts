import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../patient-registration/confirm-dialog.component';
import { TariffService, Tariff } from '../../services/tariff.service';

@Component({
  selector: 'app-standard-tariff',
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
    MatSelectModule
  ],
  templateUrl: './standard-tariff.component.html',
  styleUrls: ['./standard-tariff.component.css']
})
export class StandardTariffComponent implements OnInit {
  activeTabIndex = 0;
  displayedColumns: string[] = ['tariffCode', 'tariffName', 'contactPerson', 'validityFrom', 'validityTo', 'actions'];
  tariffs: Tariff[] = [];
  searchText: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  isEditMode: boolean = false;

  newTariff: Tariff = {
    tariffCode: '',
    tariffName: '',
    contactPerson: '',
    validityFrom: '',
    validityTo: '',
    statusId: 1,
    createdBy: 'admin',
    createdIp: '192.168.1.163',
    createdOn: new Date()
  };

  constructor(private snackBar: MatSnackBar, private tariffService: TariffService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTariffs();
  }

  loadTariffs(): void {
    this.tariffService.getAll().subscribe({
      next: (data: Tariff[]) => this.tariffs = data,
      error: () => this.snackBar.open('❌ Failed to load tariffs', 'Close', { duration: 3000 })
    });
  }

  get pagedTariffs(): Tariff[] {
    const filtered = this.tariffs.filter(tariff =>
      (tariff.tariffName || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (tariff.tariffCode || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (tariff.contactPerson || '').toLowerCase().includes(this.searchText.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    const totalFiltered = this.tariffs.filter(tariff =>
      (tariff.tariffName || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (tariff.tariffCode || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (tariff.contactPerson || '').toLowerCase().includes(this.searchText.toLowerCase())
    ).length;
    return Math.ceil(totalFiltered / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  viewTariff(tariff: Tariff): void {
    this.snackBar.open(`👁️ Viewing tariff: ${tariff.tariffName}`, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  editTariff(tariff: Tariff): void {
    this.newTariff = { ...tariff };
    this.isEditMode = true;
    this.activeTabIndex = 1;
  }

  resetForm(): void {
    this.newTariff = {
      tariffCode: '',
      tariffName: '',
      contactPerson: '',
      validityFrom: '',
      validityTo: '',
      statusId: 1,
      createdBy: 'admin',
      createdIp: '192.168.1.163',
      createdOn: new Date()
    };
    this.isEditMode = false;
  }

  formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  onSubmit(): void {
    if (!this.newTariff.tariffCode || !this.newTariff.tariffName) {
      this.snackBar.open('⚠️ Fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const now = new Date();

    const formattedTariff: Tariff = {
      ...this.newTariff,
      createdOn: this.formatDate(now),
      validityFrom: this.formatDate(new Date(this.newTariff.validityFrom)),
      validityTo: this.formatDate(new Date(this.newTariff.validityTo)),
      createdBy: 'admin',
      createdIp: '192.168.1.163'
    };

    const call = this.isEditMode
      ? this.tariffService.update(formattedTariff)
      : this.tariffService.create(formattedTariff);

    call.subscribe({
      next: () => {
        this.snackBar.open(`✅ Tariff ${this.isEditMode ? 'updated' : 'added'} successfully!`, 'Close', { duration: 3000 });
        this.resetForm();
        this.loadTariffs();
        this.activeTabIndex = 0;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('❌ Operation failed!', 'Close', { duration: 3000 });
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
    const total = this.tariffs.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  }

  deleteTariff(tariff: Tariff): void {
    if (!tariff?.tariffCode) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tariffService.delete(tariff.tariffCode).subscribe({
          next: () => {
            this.snackBar.open('✅ Tariff deleted successfully.', 'Close', { duration: 3000 });
            this.loadTariffs();
          },
          error: () => {
            this.snackBar.open('❌ Delete failed.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
