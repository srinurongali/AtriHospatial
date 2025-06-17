import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Procedure {
  procedureId?: number | string;
  procedureName?: string;
  procedureCode?: string;
  statusId?: number;
  addedBy?: string;
  addedIp?: string;
  addedOn?: Date | string;                                                                 
}

@Injectable({ 
  providedIn: 'root',
})
export class ProcedureService {
  private apiUrl = `${environment.apiUrl}/procedures`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getProcedures(): Observable<Procedure[]> {
    return this.http.get<Procedure[]>(`${this.apiUrl}/all`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addProcedure(procedure: Procedure): Observable<Procedure> {
    const formatted = {
      procedureName: procedure.procedureName,
      procedureCode: procedure.procedureCode,
      statusId: procedure.statusId,
      addedBy: procedure.addedBy,
      addedIp: procedure.addedIp,
      addedOn: procedure.addedOn
    };
    return this.http.post<Procedure>(`${this.apiUrl}/create`, formatted, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteProcedure(id: number | string): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    const body = { procedureId: id };

    return this.http.request('DELETE', url, {
      body,
      headers: this.httpOptions.headers
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
