import { Routes } from '@angular/router';
import { StandardAllergyComponent } from './components/standard-allergy/standard-allergy.component';
import { StandardProcedureComponentsComponent } from './components/standard-procedure-components/standard-procedure-components.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';
import { AppointmentBookingComponent } from './components/appointment-booking/appointment-booking.component';
import { PaymentTypeComponent } from './components/payment-type/payment-type.component';

export const routes: Routes = [
  { path: '', redirectTo: 'patient-registration', pathMatch: 'full' },

  // Patient Registration
  { path: 'patient-registration', component: PatientRegistrationComponent },

  // Appointment Booking
  { path: 'appointment-booking', component: AppointmentBookingComponent },  // ✅ Add comma here

  // Master data setup
  { path: 'standard-allergy', component: StandardAllergyComponent },
  { path: 'standard-procedure', component: StandardProcedureComponentsComponent },

  // Payment Type
  { path: 'payment', component: PaymentTypeComponent },

  // Wildcard fallback
  { path: '**', redirectTo: 'patient-registration' }
];
