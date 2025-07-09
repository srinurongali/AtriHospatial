import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Organization {
  organizationCode: string;
  organizationType: string;
  organizationName: string;
  shortname?: string;
  creditLimit?: number;
  billClearanceDays?: number;
  payMethod?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  statusId?: number;
  organizationMobile?: string;
  website?: string;
  contactPersonName?: string;
  designation?: string;
  department?: string;
  email?: string;
  mobNum?: string;
  tariffCode?: string;
  tariffName?: string;
  createdBy?: string;
  createdIp?: string;
  createdOn?: Date;
}

export interface Tariff {
  tariffCode: string;
  tariffName: string;
}

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private baseUrl = `${environment.apiUrl}/organization`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.baseUrl}/getAll`);
  }

  save(org: Organization): Observable<Organization> {
    return this.http.post<Organization>(`${this.baseUrl}/save`, org);
  }

  delete(organizationCode: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${organizationCode}`);
  }
}
