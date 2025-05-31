import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Allergy {
  allergyName: string;
  allergyCode: string;
  allergyType:string;
  statusId?: number;
  addedBy?: string;
  addedIp?: string;
  addedOn?: Date;
  allergyId?: number | string;
}

@Component({
  selector: 'app-allergy-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allergy-detail-modal.component.html',
  styleUrl: './allergy-detail-modal.component.css',
})
export class AllergyDetailModalComponent {
  @Input() allergy: Allergy | null = null;
  isVisible = false;

  show(allergy: Allergy) {
    this.allergy = allergy;
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
    this.allergy = null;
  }
} 