import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, of, tap } from 'rxjs';

export interface Allergy {
  allergyName?: string;
  allergyCode?: string;
  allergyType?:string;
  statusId?: number;
  addedBy?: string;
  addedIp?: string;
  addedOn?: Date | string;
  allergyId?: number | string;
  name?: string;
  code?: string;
  type?: string;
  id?: number | string;
  allergy_name?: string;
  allergy_code?: string;
  allergy_type?: string;
  allergy_id?: number | string;
  added_by?: string;
  added_ip?: string;
  added_on?: Date | string;
}

@Injectable({
  providedIn: 'root',
})
export class AllergyService {
  private apiUrl = '/api/allergies';
  private storageKey = 'allergies';

  constructor(private http: HttpClient) {
    console.log('AllergyService initialized with API URL:', this.apiUrl);
  }

  private getStoredAllergies(): Allergy[] {
    const stored = localStorage.getItem(this.storageKey);
    console.log('Getting stored allergies from localStorage:', stored);
    return stored ? JSON.parse(stored) : [];
  }

  private setStoredAllergies(allergies: Allergy[]): void {
    console.log('Setting allergies in localStorage:', allergies);
    localStorage.setItem(this.storageKey, JSON.stringify(allergies));
  }

  getAllergies(): Observable<Allergy[]> {
    console.log('Fetching allergies from API:', this.apiUrl);
    return this.http.get<Allergy[]>(this.apiUrl).pipe(
      tap(data => {
        console.log('API response received:', JSON.stringify(data, null, 2));
      }),
      catchError((error) => {
        console.log('API error, using local storage as fallback:', error);
        const storedData = this.getStoredAllergies();
        console.log('Local storage data:', storedData);
        return of(storedData);
      })
    );
  }

  addAllergy(allergy: Allergy): Observable<Allergy> {
    console.log('Adding new allergy:', JSON.stringify(allergy, null, 2));
    return this.http.post<Allergy>(`${this.apiUrl}/Create`, allergy).pipe(
      tap(response => {
        console.log('Add allergy API response:', JSON.stringify(response, null, 2));
      }),
      catchError((error) => {
        console.log('API error, using local storage as fallback:', error);
        const allergies = this.getStoredAllergies();
        const newAllergy = { ...allergy, allergyId: Date.now().toString() };
        allergies.push(newAllergy);
        this.setStoredAllergies(allergies);
        return of(newAllergy);
      })
    );
  }

  deleteAllergy(identifier: number | string): Observable<void> {
    console.log('Deleting allergy with identifier:', identifier);
    return this.http.delete<void>(`${this.apiUrl}/${identifier}`).pipe(
      tap(() => {
        console.log('Delete allergy API call successful');
      }),
      catchError((error) => {
        console.log('API error, using local storage as fallback:', error);
        const allergies = this.getStoredAllergies();
        const index = allergies.findIndex(a => a.allergyId === identifier);
        if (index > -1) {
          allergies.splice(index, 1);
          this.setStoredAllergies(allergies);
        }
        return of(void 0);
      })
    );
  }

  updateAllergy(allergy: Allergy): Observable<Allergy> {
    console.log('Updating allergy:', JSON.stringify(allergy, null, 2));
    return this.http.put<Allergy>(`${this.apiUrl}/update`, allergy).pipe(
      tap(response => {
        console.log('Update allergy API response:', JSON.stringify(response, null, 2));
      }),
      catchError((error) => {
        console.log('API error, using local storage as fallback:', error);
        const allergies = this.getStoredAllergies();
        const index = allergies.findIndex(a => a.allergyId === allergy.allergyId);
        if (index > -1) {
          allergies[index] = allergy;
          this.setStoredAllergies(allergies);
        }
        return of(allergy);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Backend error'));
  }
}
