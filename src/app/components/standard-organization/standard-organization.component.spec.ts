import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-standard-organization',
  templateUrl: './standard-organization.component.html',
  styleUrls: ['./standard-organization.component.css']
})
export class StandardOrganizationComponent implements OnInit {
  orgForm: FormGroup;
  organizations = [];
  orgTypes = ['Type1', 'Type2'];
  paymentMethods = ['Cash', 'UPI', 'Card'];
  billingFrequencies = ['Monthly', 'Quarterly'];
  countries = ['India', 'USA'];
  states = ['State1', 'State2'];
  contactTypes = ['Emergency', 'Primary'];
  priorities = [1, 2, 3];

  constructor(private fb: FormBuilder) {
    this.orgForm = this.fb.group({
      code: [''],
      type: [''],
      name: [''],
      shortName: [''],
      creditLimit: [''],
      billClearanceDays: [''],
      paymentMethod: [''],
      billingFrequency: [''],
      address: [''],
      country: [''],
      state: [''],
      city: [''],
      mobile: [''],
      phone: [''],
      fax: [''],
      website: [''],
      contactType: [''],
      contactPersonName: [''],
      designation: [''],
      department: [''],
      email: [''],
      contactMobile: [''],
      contactPhone: [''],
      priority: [''],
      tariffName: [''],
      tariffCode: ['']
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.organizations.push(this.orgForm.value);
    this.orgForm.reset();
  }

  addContact() {
    // Add contact logic here
  }

  addPriority() {
    // Add priority logic here
  }

  viewOrg(org: any) {
    // View org logic here
  }

  deleteOrg(org: any) {
    this.organizations = this.organizations.filter(o => o !== org);
  }
}
