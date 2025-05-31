import { Routes } from '@angular/router';
import { StandardAllergyComponent } from './components/standard-allergy/standard-allergy.component';
import { StandardProcedureComponent } from './components/standard-procedure/standard-procedure.component';

export const routes: Routes = [
  { path: 'standard-allergy', component: StandardAllergyComponent },
  { path: 'standard-procedure', component: StandardProcedureComponent },
];
