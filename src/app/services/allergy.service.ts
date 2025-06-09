import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Allergy {
  allergyId?: number | string;
  allergyName?: string;
  allergyCode?: string;
  allergyType?: string;
  statusId?: number;
  addedBy?: string;
  addedIp?: string;
  addedOn?: Date | string;
}

@Injectable({
  providedIn: 'root',
})
export class AllergyService {
  private apiUrl = `${environment.apiUrl}/allergies`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // ✅ Add this method
  getAllergies(): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(`${this.apiUrl}/all`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addAllergy(allergy: Allergy): Observable<Allergy> {
    const formatted = {
      allergyName: allergy.allergyName,
      allergyCode: allergy.allergyCode,
      allergyType: allergy.allergyType,
      statusId: allergy.statusId,
      addedBy: allergy.addedBy,
      addedIp: allergy.addedIp,
    };
    return this.http.post<Allergy>(`${this.apiUrl}/create`, formatted, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
   updateAllergy(allergy: Allergy): Observable<any> {
  if (!allergy.allergyId) {
    return throwError(() => new Error('Allergy ID is required for update.'));
  }
  return this.http.put(`${this.apiUrl}/update`, allergy, this.httpOptions).pipe(
    catchError(this.handleError)
  );
}


  deleteAllergy(id: number | string): Observable<void> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Deleted-By': 'admin',
    'X-Deleted-IP': '192.168.1.163'
  });
  


  return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers }).pipe(
    catchError(this.handleError)
  );
}

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error instanceof ErrorEvent
      ? error.error.message
      : `Server returned code ${error.status}`;
    return throwError(() => new Error(message));
  }
}
