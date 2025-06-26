import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  saveAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, appointment);
  }

  updateAppointment(appointment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, appointment);
  }

  getAllAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }
}
