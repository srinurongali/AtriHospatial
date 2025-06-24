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
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';

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
    MatTooltipModule,
    MatTableModule
  ],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit {
  appointmentForm!: FormGroup;
  selectedPatient: Patient | null = null;
  consultants: DoctorDropdownDto[] = [];
  
  displayedColumns: string[] = ['umrNo', 'name', 'age', 'gender', 'action'];
  dataSource!: MatTableDataSource<Patient>;
  allPatients: Patient[] = [];

  locations: string[] = ['Indus Hospital', 'Care Hospital'];

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
    this.appointmentForm = this.fb.group({
      location: ['', Validators.required],
      date: ['', Validators.required],
      consultant: [null, Validators.required],
      specialization: ['']
    });

    this.loadPatients();
    this.loadDoctors();
    this.calculateTotal();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.allPatients = patients;
        this.dataSource = new MatTableDataSource<Patient>([]);
        this.dataSource.filterPredicate = (data: Patient, filter: string) => {
          return (data.umrNumber || '').toLowerCase() === filter.toLowerCase();
        };
      },
      error: (error) => {
        this.snackBar.open('Error loading patients', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe(doctors => {
      this.consultants = doctors;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.dataSource.data = this.allPatients.filter(patient =>
        (patient.umrNumber || '').toLowerCase() === filterValue
      );
    } else {
      this.dataSource.data = [];
    }
  }

  selectPatient(patient: Patient) {
    this.selectedPatient = patient;
    this.snackBar.open('Patient selected successfully', 'Close', {
      duration: 2000,
      verticalPosition: 'top'
    });
  }

  onConsultantSelect(doctorId: number | null) {
    const consultant = this.consultants.find(c => c.doctorId === doctorId) || null;
    if (consultant) {
      this.appointmentForm.get('specialization')?.setValue(consultant.specialization);
    } else {
      this.appointmentForm.get('specialization')?.setValue('');
    }
  }

  calculateTotal() {
    this.totalAmount = this.registrationFee + this.consultantFee;
  }

  submit() {
    if (this.appointmentForm.invalid || !this.selectedPatient) {
      this.snackBar.open('Please fill all required fields and select a patient.', 'Close', {
        duration: 3000
      });
      return;
    }

    const mockAppointmentId = `APP${Date.now()}`;

    this.router.navigate(['/payment'], {
      queryParams: {
        appointmentId: mockAppointmentId,
        patientName: `${this.selectedPatient.firstName} ${this.selectedPatient.lastName}`,
        regFee: this.registrationFee,
        consultantFee: this.consultantFee
      }
    });
  }
}
