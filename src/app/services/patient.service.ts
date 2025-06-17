import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Patient {
  title?: string;
  firstName: string;
  lastName?: string;
  dob?: string;
  ageYears?: number;
  ageMonths?: number;
  ageDays?: number;
  gender?: string;
  mobileNo: string;
  country?: string;
  state?: string;
  city?: string;
  village?: string;
  address: string;
  walkInType?: string;
  organization?: string;
  occupation?: string;
  idProofType?: string;
  idProofNumber?: string;
  careBy?: string;
  parentOrHusbandName?: string;
  religion?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  healthIssue?: string;
  smsNotification?: boolean;
  createdBy?: string;
  createdIp?: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {

  private baseUrl = `${environment.apiUrl}/patient`; // http://192.168.1.186:8080/api/patient

  constructor(private http: HttpClient) {}

  registerPatient(patient: Patient): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, patient);
  }

  getAllPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAll`);
  }

}
