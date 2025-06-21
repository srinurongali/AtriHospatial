import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-type',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.css']
})
export class PaymentTypeComponent implements OnInit {
  patientName: string = 'N/A';
  appointmentId: string = 'N/A';
  registrationFee: number = 0;
  consultantFee: number = 0;
  totalAmount: number = 0;
  selectedPaymentMethod: string = 'Card';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.patientName = params['patientName'] || 'N/A';
      this.appointmentId = params['appointmentId'] || 'N/A';
      this.registrationFee = +params['regFee'] || 50;
      this.consultantFee = +params['consultantFee'] || 600;
      this.totalAmount = this.registrationFee + this.consultantFee;
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedPaymentMethod = event.tab.textLabel;
  }

  processPayment(): void {
    // Logic to process payment based on this.selectedPaymentMethod
    console.log(`Processing ${this.selectedPaymentMethod} payment for ₹${this.totalAmount}`);
    
    // On successful payment:
    alert(`Payment of ₹${this.totalAmount} via ${this.selectedPaymentMethod} was successful!`);
    this.router.navigate(['/']); // Navigate to a confirmation page or home
  }

  cancelPayment(): void {
    console.log('Payment cancelled.');
    this.router.navigate(['/appointment-scheduling']); // Navigate back to scheduling
  }
}
