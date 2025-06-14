import { Routes } from '@angular/router';
import { StandardAllergyComponent } from './components/standard-allergy/standard-allergy.component';
import { StandardProcedureComponentsComponent } from './components/standard-procedure-components/standard-procedure-components.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';

export const routes: Routes = [
  { path: 'standard-allergy', component: StandardAllergyComponent },
  { path: 'standard-procedure', component: StandardProcedureComponentsComponent },
  { path: 'patient-registration', component: PatientRegistrationComponent }
];
