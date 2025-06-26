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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../patient-registration/confirm-dialog.component';
import { AppointmentService } from '../../services/appointment.service';

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
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appointmentService: AppointmentService
  ) {}

 ngOnInit(): void {
  this.appointmentForm = this.fb.group({
    location: ['', Validators.required],
    date: ['', Validators.required],
    consultant: [null, Validators.required],
    specialization: ['']
  });

  this.loadDoctors();
  this.calculateTotal();

  // Read patient details from query params
  this.route.queryParams.subscribe(params => {
    const umrNo = params['umrNo'];
    const patientName = params['patientName'];
    const age = params['age'];
    const gender = params['gender'];

    if (umrNo) {
      // Load patients and auto-select the matched one
      this.patientService.getAllPatients().subscribe({
        next: (patients) => {
          this.allPatients = patients;
          const matchedPatient = patients.find(p => p.umrNumber === umrNo);

          if (matchedPatient) {
            this.selectedPatient = matchedPatient;
            this.dataSource = new MatTableDataSource<Patient>([matchedPatient]);

            this.snackBar.open('✅ Registered patient pre-filled', 'Close', {
              duration: 2000,
              verticalPosition: 'top'
            });
          } else {
            this.dataSource = new MatTableDataSource<Patient>([]);
            this.snackBar.open('⚠️ Patient not found in the records', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
        },
        error: () => {
          this.snackBar.open('❌ Error loading patient records', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    } else {
      // No patient in query params, load all empty
      this.loadPatients();
    }
  });
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
    this.consultants = doctors.map(doc => ({
      doctorId: doc.doctorId,
      doctorName: doc.doctorName,
      displayName: doc.doctorName,
      specialization: doc.specialization || 'N/A'
    }));
  });
}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      const filtered = this.allPatients.filter(patient =>
        (patient.umrNumber || '').toLowerCase() === filterValue ||
        (`${patient.firstName} ${patient.lastName}`.toLowerCase().includes(filterValue))
      );
      this.dataSource.data = filtered;
      if (filtered.length === 1) {
        this.selectPatient(filtered[0]);
      } else {
        this.selectedPatient = null;
      }
    } else {
      this.dataSource.data = [];
      this.selectedPatient = null;
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

    // Prepare appointment data for backend
    const appointmentData = {
      umrNumber: this.selectedPatient.umrNumber,
      doctorId: this.appointmentForm.value.consultant,
      appointmentDate: this.appointmentForm.value.date,
      location: this.appointmentForm.value.location,
      createdBy: 'admin', // Replace with actual user if available
      createdIp: '127.0.0.1' // Replace with actual IP if available
    };

    this.appointmentService.saveAppointment(appointmentData).subscribe({
      next: (response) => {
        // Only after backend confirms, show success and payment dialog
        this.snackBar.open('Appointment details saved successfully.', 'Close', {
          duration: 2000,
          verticalPosition: 'top'
        });

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Book Payment',
            message: 'Do you want to book payment?'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Use backend response for payment navigation
            this.router.navigate(['/payment'], {
              queryParams: {
                appointmentId: response.appointmentId,
                patientName: response.patientName,
                regFee: this.registrationFee,
                consultantFee: this.consultantFee
              }
            });
          }
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to save appointment: ' + (err.error?.message || 'Unknown error'), 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }
}
