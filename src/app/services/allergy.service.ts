import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';  // ⬅️ make sure to import 'map'
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

  // ✅ Get ALL allergies
  getAllergies(): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(`${this.apiUrl}/all`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Get only ACTIVE (statusId = 1) allergies
  getActiveAllergies(): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(`${this.apiUrl}/all`, this.httpOptions).pipe(
      map(allergies => allergies.filter(allergy => allergy.statusId === 1)),
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
      addedOn: allergy.addedOn,
      addedIp: allergy.addedIp
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

  deleteAllergy(id: number | string): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    const body = { allergyId: id };

    return this.http.request('DELETE', url, {
      body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    }).pipe(
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