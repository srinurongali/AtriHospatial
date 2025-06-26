import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DoctorDropdownDto {
  doctorId: number;
  doctorName: string;
  displayName: string;
  specialization: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors/getAll`;

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<DoctorDropdownDto[]> {
    return this.http.get<DoctorDropdownDto[]>(this.apiUrl);
  }
}
