import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  saveAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, data);
  }

  getDoctorSlots(doctorId: number, date: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/doctor-slots/${doctorId}/${date}`);
  }
}
