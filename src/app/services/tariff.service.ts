// src/app/services/tariff.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tariff {
  tariffCode: string;
  tariffName: string;
  contactPerson: string;
  validityFrom: string;
  validityTo: string;
  statusId: number;
  createdBy: string;
  createdIp: string;
  createdOn: any;
}


@Injectable({
  providedIn: 'root'
})
export class TariffService {
  private api = `${environment.apiUrl}/tariffs`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tariff[]> {
    return this.http.get<Tariff[]>(`${this.api}/all`);
  }

  create(tariff: Tariff): Observable<any> {
    return this.http.post(`${this.api}/create`, tariff);
  }

  update(tariff: Tariff): Observable<any> {
    return this.http.put(`${this.api}/update`, tariff);
  }

  delete(code: string): Observable<any> {
    return this.http.request('delete', `${this.api}/delete`, {
      body: { tariffCode: code }
    });
  }
}
