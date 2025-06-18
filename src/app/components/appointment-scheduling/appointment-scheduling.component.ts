import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-appointment-scheduling',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './appointment-scheduling.component.html',
  styleUrls: ['./appointment-scheduling.component.css']
})
export class AppointmentSchedulingComponent implements OnInit {
  appointmentForm!: FormGroup;
  doctors: any[] = [];
  slots: any[] = [];
  selectedSlotId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      hospital: ['INDUS HOSPITALS', Validators.required],
      appointmentDate: [new Date(), Validators.required],
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      consultant: ['', Validators.required],
      location: ['GENERAL MEDICINE', Validators.required]
    });

    this.getDoctors();
  }

  getDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res;
      },
      error: (err: any) => {
        console.error('Failed to load doctors:', err);
      }
    });
  }

  loadDoctorSlots() {
    const doctorId = this.appointmentForm.value.doctorId;
    const date = this.formatDate(this.appointmentForm.value.appointmentDate);

    if (doctorId && date) {
      this.appointmentService.getDoctorSlots(doctorId, date).subscribe({
        next: (res: any) => {
          this.slots = res;
        },
        error: (err: any) => {
          console.error('Failed to load slots:', err);
        }
      });
    }
  }

  formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  selectSlot(slot: any) {
    if (!slot.booked) {
      this.selectedSlotId = slot.slotId;
    }
  }

  submit() {
    if (this.appointmentForm.invalid || !this.selectedSlotId) {
      alert('Please fill all required fields and select a slot.');
      return;
    }

    const payload = {
      ...this.appointmentForm.value,
      appointmentDate: this.formatDate(this.appointmentForm.value.appointmentDate),
      slotId: this.selectedSlotId
    };

    this.appointmentService.saveAppointment(payload).subscribe({
      next: () => alert('Appointment Saved!'),
      error: () => alert('Failed to save appointment')
    });
  }
}
