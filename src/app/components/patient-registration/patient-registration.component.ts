import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { PatientService } from '../../services/patient.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

// Angular Material UI modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class PatientRegistrationComponent {
  organizations = ['Apollo Hospitals', 'KIMS', 'Sunshine', 'AIIMS'];
  occupations = ['Engineer', 'Doctor', 'Farmer', 'Teacher'];

  constructor(
    private snackBar: MatSnackBar,
    private patientService: PatientService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      this.snackBar.open('⚠️ Please fill in required fields', 'Close', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const formData = {
      ...form.value,
      smsNotification: !!form.value.smsNotification,
      walkInType: form.value.walkIn ? 'Yes' : 'No',
      createdBy: 'admin',
      createdIp: '127.0.0.1'
    };

    this.patientService.registerPatient(formData).subscribe({
      next: (registeredPatient) => {
        this.snackBar.open('✅ Patient registered successfully!', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        form.resetForm();

        this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Book Appointment?',
            message: 'Do you want to book an appointment for this patient?'
          }
        }).afterClosed().subscribe(result => {
          if (result) {
            this.router.navigate(['/appointment-booking'], {
              queryParams: {
                umrNo: registeredPatient.umrNumber || '',
                patientName: `${registeredPatient.firstName || ''} ${registeredPatient.lastName || ''}`,
                age: registeredPatient.ageYears || '',
                gender: registeredPatient.gender || ''
              }
            });
          }
        });
      },
      error: () => {
        this.snackBar.open('❌ Failed to save patient data', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
