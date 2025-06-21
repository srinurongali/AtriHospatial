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
import { PatientService, Patient } from '../../services/patient.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatNativeDateModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit {
  appointmentForm!: FormGroup;

  patient = {
    umrNo: '',
    patientName: '',
    age: '',
    gender: ''
  };

  consultants: DoctorDropdownDto[] = [];

  registrationFee = 50;
  consultantFee = 600;
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.patient = {
        umrNo: params['umrNo'] || 'N/A',
        patientName: params['patientName'] || 'N/A',
        age: params['age'] || 'N/A',
        gender: params['gender'] || 'N/A'
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

  searchPatient(umrNumber: string) {
    if (!umrNumber) {
      this.snackBar.open('Please enter a UMR number to search.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }

    this.patientService.getPatientByUmr(umrNumber).subscribe({
      next: (data: Patient) => {
        this.patient = {
          umrNo: data.umrNumber || 'N/A',
          patientName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          age: (data.ageYears || 'N/A').toString(),
          gender: data.gender || 'N/A'
        };
        this.snackBar.open('✅ Patient found successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      error: () => {
        this.snackBar.open('❌ Patient not found with the provided UMR number.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.patient = { umrNo: 'N/A', patientName: 'N/A', age: 'N/A', gender: 'N/A' };
      }
    });
  }

  onConsultantSelect(doctorId: number) {
    const selected = this.consultants.find(c => c.doctorId === doctorId);
    if (selected) {
      this.appointmentForm.get('specialization')?.setValue(selected.specialization);
    }
  }

  calculateTotal() {
    this.totalAmount = this.registrationFee + this.consultantFee;
  }

  submit() {
    if (this.appointmentForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', {
        duration: 3000
      });
      return;
    }

    // Generate a mock appointment ID for this session
    const mockAppointmentId = `APP${Date.now()}`;

    // On successful booking, navigate to the payment screen
    this.router.navigate(['/payment'], {
      queryParams: {
        appointmentId: mockAppointmentId,
        patientName: this.patient.patientName,
        regFee: this.registrationFee,
        consultantFee: this.consultantFee
      }
    });
  }
}