import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Procedure {
  procedureCode: string;
  procedureName: string;
  // Add other fields as needed
}

@Injectable({ providedIn: 'root' })
export class ProcedureService {
  private baseUrl = `${environment.apiUrl}/procedure`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Procedure[]> {
    return this.http.get<Procedure[]>(`${this.baseUrl}/getAll`);
  }

  save(proc: Procedure): Observable<Procedure> {
    return this.http.post<Procedure>(`${this.baseUrl}/save`, proc);
  }

  update(proc: Procedure): Observable<Procedure> {
    return this.http.put<Procedure>(`${this.baseUrl}/update`, proc);
  }

  delete(proCode: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${proCode}`);
  }
}
