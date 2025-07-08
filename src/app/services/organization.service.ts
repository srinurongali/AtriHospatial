import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Organization {
  organizationCode: string;
  organizationType: string;
  organizationName: string;
  shortname: string;
  creditLimit: number;
  billClearanceDays: number;
  payMethod: string;
  address: string;
  country: string;
  state: string;
  city: string;
  statusId?: number;
  organizationMobile: string;
  website: string;
  contactPersonName: string;
  designation: string;
  department: string;
  email: string;
  mobNum: string;
  tariffCode?: string;
  createdBy?: string;
  createdIp?: string;
  createdOn?: string;
  modifiedBy?: string;
  modifiedIp?: string;
  modifiedOn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = `${environment.apiUrl}/organization`;

  constructor(private http: HttpClient) {}

  // ✅ Save new organization
  save(org: Organization): Observable<Organization> {
    return this.http.post<Organization>(`${this.apiUrl}/save`, org);
  }

  // ✅ Update existing organization (PUT)
  update(org: Organization): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/update`, org);
  }

  // ✅ Patch update (Partial update)
  patch(org: Partial<Organization>): Observable<Organization> {
    return this.http.patch<Organization>(`${this.apiUrl}/patch`, org);
  }

  // ✅ Get all active organizations
  getAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/getAll`);
  }

  // ✅ Delete organization (soft delete)
  delete(organizationCode: string): Observable<Organization> {
    return this.http.delete<Organization>(`${this.apiUrl}/delete/${organizationCode}`);
  }
}
