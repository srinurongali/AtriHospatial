import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Allergy {
  allergyName: string;
  allergyCode: string;
  allergyType: string;
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
  styleUrls: ['./allergy-detail-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  // Optimize change detection
})
export class AllergyDetailModalComponent {
  @Input() allergy: Allergy | null = null;
  isVisible = false;

  // Show the modal with the allergy details
  show(allergy: Allergy) {
    this.allergy = allergy;
    this.isVisible = true;
  }

  // Hide the modal
  hide() {
    this.isVisible = false;
    this.allergy = null;
  }
}
