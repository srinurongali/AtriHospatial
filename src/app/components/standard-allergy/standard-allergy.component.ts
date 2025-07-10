import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllergyService, Allergy } from '../../services/allergy.service';
import { tap } from 'rxjs/operators';

// Angular Material Modules
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../patient-registration/confirm-dialog.component';

@Component({
  selector: 'app-standard-allergy',
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
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './standard-allergy.component.html',
  styleUrls: ['./standard-allergy.component.css']
})
export class StandardAllergyComponent implements OnInit {
  activeTabIndex = 0;
  displayedColumns: string[] = ['name', 'code', 'type', 'actions'];
  allergies: Allergy[] = [];

  searchText: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;

  isEditMode: boolean = false;

  newAllergy: Allergy = {
    allergyName: '',
    allergyCode: '',
    allergyType: '',
    statusId: 1,
    addedBy: 'admin',
    addedIp: '192.168.1.163',
    addedOn: new Date()
  };

  constructor(
    private allergyService: AllergyService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllergies();
  }

  loadAllergies(): void {
    this.allergyService.getActiveAllergies().pipe(
      tap((data: Allergy[]) => {
        this.allergies = data.map((item: Allergy) => ({
          allergyName: item.allergyName || '',
          allergyCode: item.allergyCode || '',
          allergyType: item.allergyType || '',
          allergyId: item.allergyId,
          statusId: item.statusId,
          addedBy: item.addedBy,
          addedIp: item.addedIp,
          addedOn: item.addedOn ? new Date(item.addedOn) : undefined
        }));
      })
    ).subscribe({
      next: () => console.log('Allergies loaded'),
      error: (error: any) => {
        console.error('Error loading allergies:', error);
        this.snackBar.open('❌ Failed to load allergies', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.allergies = [];
      }
    });
  }

  get pagedAllergies(): Allergy[] {
    const filtered = this.allergies.filter(allergy =>
      (allergy.allergyName || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (allergy.allergyCode || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (allergy.allergyType || '').toLowerCase().includes(this.searchText.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    const totalFiltered = this.allergies.filter(allergy =>
      (allergy.allergyName || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (allergy.allergyCode || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (allergy.allergyType || '').toLowerCase().includes(this.searchText.toLowerCase())
    ).length;
    return Math.ceil(totalFiltered / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  viewAllergy(allergy: Allergy): void {
    this.snackBar.open(`👁️ Viewing allergy: ${allergy.allergyName}`, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  editAllergy(allergy: Allergy): void {
    this.newAllergy = { ...allergy };
    this.isEditMode = true;
    this.activeTabIndex = 1;
  }

  resetForm(): void {
    this.newAllergy = {
      allergyName: '',
      allergyCode: '',
      allergyType: '',
      statusId: 1,
      addedBy: 'admin',
      addedIp: '192.168.1.163',
      addedOn: new Date()
    };
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.newAllergy.allergyName && this.newAllergy.allergyCode) {
          this.newAllergy.addedOn = this.formatDateWithoutMilliseconds(new Date());

      if (this.isEditMode && this.newAllergy.allergyId) {

        this.allergyService.updateAllergy(this.newAllergy).subscribe({
          next: () => {
            this.snackBar.open('✅ Allergy updated successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.resetForm();
            this.loadAllergies();
            this.activeTabIndex = 0;
          },
          error: (error) => {
            console.error('Update error:', error);
            this.snackBar.open('❌ Failed to update allergy.', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
        });
      } else {
        this.allergyService.addAllergy(this.newAllergy).subscribe({
          next: () => {
            this.snackBar.open('✅ Allergy added successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.resetForm();
            this.loadAllergies();
            this.activeTabIndex = 0;
          },
          error: (error) => {
            console.error('Add error:', error);
            this.snackBar.open('❌ Failed to add allergy.', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
        });
      }
    } else {
      this.snackBar.open('⚠️ Please fill in all required fields.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
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
    const total = this.allergies.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  }
deleteAllergy(allergy: Allergy): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete?'
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (!allergy || !allergy.allergyId) {
        this.snackBar.open('⚠️ Invalid allergy data.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;
      }

      this.allergyService.deleteAllergy(allergy.allergyId).subscribe({
        next: () => {
          this.snackBar.open('✅ Allergy deleted successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.loadAllergies(); // ✅ refreshes the list
        },
        error: (error) => {
          console.error('Error deactivating allergy:', error);
          this.snackBar.open(`❌ Failed to deactivate allergy: ${error.message || error.statusText || 'Unknown error'}`, 'Close', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }
      });
    }
  });
}
formatDateWithoutMilliseconds(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}




}  