import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PatientService } from '../../services/patient.service';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

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
    MatSnackBarModule
  ]
})
export class PatientRegistrationComponent {
  organizations = ['Apollo Hospitals', 'KIMS', 'Sunshine', 'AIIMS'];
  occupations = ['Engineer', 'Doctor', 'Farmer', 'Teacher'];

  constructor(private snackBar: MatSnackBar,
     private patientService: PatientService,
        private router: Router
) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = {
        ...form.value,
        smsNotification: !!form.value.smsNotification,
        walkInType: form.value.walkIn ? 'Yes' : 'No',
        createdBy: 'admin',
        createdIp: '127.0.0.1'
      };

      this.patientService.registerPatient(formData).subscribe({
        next: () => {
          this.snackBar.open('✅ Patient registered successfully!', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          form.resetForm();

          // navigate to patient list after slightly dely 


          setTimeout(()=>{
            this.router.navigate(['/patient-list']);
          }, 500);
        },
        error: () => {
          this.snackBar.open('❌ Failed to save patient data', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    } else {
      this.snackBar.open('⚠️ Please fill in required fields', 'Close', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}