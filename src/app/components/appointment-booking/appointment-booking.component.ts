import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService, DoctorDropdownDto } from '../../services/doctor.service';

@Component({
  selector: 'app-appointment-booking',
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
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit {
  appointmentForm!: FormGroup;

  patient = {
    umrNo: 'UMR123456',
    patientName: 'John Doe',
    age: 34,
    gender: 'Male'
  };

  consultants: DoctorDropdownDto[] = [];

  registrationFee = 50;
  consultantFee = 600;
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.patient = {
        umrNo: params['umrNo'] || 'UMR123456',
        patientName: params['patientName'] || 'John Doe',
        age: params['age'] || 34,
        gender: params['gender'] || 'Male'
      };
    });

    this.appointmentForm = this.fb.group({
      location: ['', Validators.required],
      date: ['', Validators.required],
      consultantName: ['', Validators.required],
      specialization: [{ value: '', disabled: true }, Validators.required]
    });

    this.calculateTotal();

    this.doctorService.getAllDoctors().subscribe(doctors => {
      this.consultants = doctors;
    });
  }

  onConsultantSelect(doctorId: number) {
    const selected = this.consultants.find(c => c.doctorId === doctorId);
    if (selected) {
      const specialization = selected.displayName.split(' - ')[1] || '';
      this.appointmentForm.get('specialization')?.setValue(specialization);
    }
  }

  calculateTotal() {
    this.totalAmount = this.registrationFee + this.consultantFee;
  }

  submit() {
    if (this.appointmentForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      ...this.appointmentForm.getRawValue(),
      umrNumber: this.patient.umrNo, // ✅ Renamed field to match backend
      totalFee: this.totalAmount
    };

    console.log('Appointment Saved:', payload);
    alert('Appointment Saved Successfully!');
    this.router.navigate(['/appointment-booking']);
  }
}
