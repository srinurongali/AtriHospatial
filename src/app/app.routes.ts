import { Routes } from '@angular/router';

// Import your standalone components
import { StandardAllergyComponent } from './components/standard-allergy/standard-allergy.component';
import { StandardProcedureComponentsComponent } from './components/standard-procedure-components/standard-procedure-components.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { AppointmentSchedulingComponent } from './components/appointment-scheduling/appointment-scheduling.component';

export const routes: Routes = [
  { path: '', redirectTo: 'patient-registration', pathMatch: 'full' },
  
  // Patient related
  { path: 'patient-registration', component: PatientRegistrationComponent },
  { path: 'patient-list', component: PatientListComponent },

  // Appointment scheduling
  { path: 'appointment-scheduling', component: AppointmentSchedulingComponent },

  // Master data
  { path: 'standard-allergy', component: StandardAllergyComponent },
  { path: 'standard-procedure', component: StandardProcedureComponentsComponent },

  // Wildcard route fallback
  { path: '**', redirectTo: 'patient-registration' }
];
