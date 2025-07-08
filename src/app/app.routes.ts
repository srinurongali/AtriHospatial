import { Routes } from '@angular/router';
import { StandardAllergyComponent } from './components/standard-allergy/standard-allergy.component';
import { StandardProcedureComponentsComponent } from './components/standard-procedure-components/standard-procedure-components.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';
import { AppointmentBookingComponent } from './components/appointment-booking/appointment-booking.component';
import { PaymentTypeComponent } from './components/payment-type/payment-type.component';
import { StandardTariffComponent } from './components/standard-tariff/standard-tariff.component';
import { StandardOrganizationComponent } from './components/standard-organization/standard-organization.component';

export const routes: Routes = [
  { path: '', redirectTo: 'patient-registration', pathMatch: 'full' },

  // Patient Registration
  { path: 'patient-registration', component: PatientRegistrationComponent },

  // Appointment Booking
  { path: 'appointment-booking', component: AppointmentBookingComponent },  // ✅ Add comma here

  // Master data setup
  { path: 'standard-allergy', component: StandardAllergyComponent },
  { path: 'standard-tariff', component: StandardTariffComponent },
  { path: 'standard-procedure', component: StandardProcedureComponentsComponent },
  {path : 'standard-organization',component:StandardOrganizationComponent},

  // Payment Type
  { path: 'payment', component: PaymentTypeComponent },

  // Wildcard fallback
  { path: '**', redirectTo: 'patient-registration' }
];
