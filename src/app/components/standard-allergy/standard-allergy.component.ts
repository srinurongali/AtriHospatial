import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllergyService, Allergy } from '../../services/allergy.service';
import { tap } from 'rxjs/operators';

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
    MatTableModule
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

  newAllergy = {
    allergyName: '',
    allergyCode: '',
    allergyType: '',
    statusId: 1,
    addedBy: 'admin',
    addedIp: '192.168.1.163',  
    addedOn: new Date()
  };

  constructor(private allergyService: AllergyService) { }

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadAllergies();
  }

  loadAllergies(): void {
    console.log('Loading allergies...');
    this.allergyService.getAllergies().pipe(
      tap(data => {
        console.log('Raw allergies data received:', JSON.stringify(data, null, 2));
        this.allergies = data.map((item: any) => ({
          allergyName: item.allergyName || item.name || item.allergy_name || '',
          allergyCode: item.allergyCode || item.code || item.allergy_code || '',
          allergyType: item.allergyType || item.type || item.allergy_type || '',
          allergyId: item.allergyId || item.id || item.allergy_id,
          statusId: item.statusId,
          addedBy: item.addedBy || item.added_by,
          addedIp: item.addedIp || item.added_ip,
          addedOn: item.addedOn || item.added_on ? new Date(item.addedOn || item.added_on) : undefined
        }));
        console.log('Normalized allergies:', JSON.stringify(this.allergies, null, 2));
        console.log('Allergies array length:', this.allergies.length);
      })
    ).subscribe({
      next: () => {
        console.log('Allergies loaded successfully');
      },
      error: (error) => {
        console.error('Error loading allergies:', error);
        this.allergies = [];
      }
    });
  }

  get pagedAllergies(): Allergy[] {
    console.log('Calculating paged allergies. Current allergies:', JSON.stringify(this.allergies, null, 2));
    const filtered = this.allergies.filter(allergy => {
      const nameMatch = (allergy?.allergyName || '').toLowerCase().includes(this.searchText.toLowerCase());
      const codeMatch = (allergy?.allergyCode || '').toLowerCase().includes(this.searchText.toLowerCase());
      const typeMatch = (allergy?.allergyType || '').toLowerCase().includes(this.searchText.toLowerCase());
      const matches = nameMatch || codeMatch || typeMatch;
      console.log('Filtering allergy:', JSON.stringify(allergy, null, 2), 'Matches:', matches);
      return matches;
    });
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const result = filtered.slice(start, start + this.itemsPerPage);
    console.log('Final paged allergies:', JSON.stringify(result, null, 2));
    return result;
  }

  get totalPages(): number {
    return Math.ceil(
      this.allergies.filter(allergy =>
        (allergy?.allergyName || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (allergy?.allergyCode || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (allergy?.allergyType || '').toLowerCase().includes(this.searchText.toLowerCase())
      ).length / this.itemsPerPage
    );
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  viewAllergy(allergy: Allergy): void {
    alert(`Viewing: ${JSON.stringify(allergy, null, 2)}`);
  }

  deleteAllergy(allergy: Allergy): void {
    const confirmed = confirm(`Delete allergy "${allergy?.allergyName || 'N/A'}"?`);
    if (confirmed) {
      const identifier = allergy?.allergyId || allergy?.allergyCode;
      if (identifier) {
        this.allergyService.deleteAllergy(identifier).subscribe({
          next: () => {
            console.log('Allergy deleted successfully:', JSON.stringify(allergy, null, 2));
            this.loadAllergies();
          },
          error: (error) => {
            console.error('Error deleting allergy:', error);
            alert('Failed to delete allergy. Check console for details.');
          }
        });
      } else {
        console.error('Allergy has no valid identifier (allergyId or allergyCode) for deletion:', JSON.stringify(allergy, null, 2));
        alert('Cannot delete allergy: Missing identifier.');
      }
    }
  }

  onSubmit(): void {
    console.log('Submitting new allergy:', JSON.stringify(this.newAllergy, null, 2));
    if (this.newAllergy.allergyName && this.newAllergy.allergyCode) {
      this.allergyService.addAllergy(this.newAllergy as Allergy).subscribe({
        next: (addedAllergy) => {
          console.log('Allergy added successfully:', JSON.stringify(addedAllergy, null, 2));
          this.loadAllergies();
          this.newAllergy = {
              allergyName: '',
              allergyCode: '',
              allergyType:'',
              statusId: 1,
              addedBy: 'admin',
              addedIp: '192.168.1.163',
              addedOn: new Date()
          };
          this.activeTabIndex = 0;
        },
        error: (error) => {
          console.error('Error adding allergy:', error);
          alert('Failed to add allergy. Check console for details.');
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
    const total = this.allergies.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  }
}
