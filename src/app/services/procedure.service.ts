import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Assume a Procedure Interface exists (or import it)
export interface Procedure {
  procedureName: string;
  procedureCode: string;
  procedureType?: string;
  procedureId?: number;
  statusId: number;
  addedBy: string;
  addedIp: string;
  addedOn: Date | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {

  private procedures: Procedure[] = [
    { procedureName: 'Surgical Procedure', procedureCode: 'SURGPRO', procedureType: 'Surgery', procedureId: 1, statusId: 1, addedBy: 'admin', addedIp: '192.168.1.1', addedOn: new Date() }
  ];

  getProcedures(): Observable<Procedure[]> {
    // Mock data or actual HTTP call
    return of(this.procedures);
  }

  addProcedure(procedure: Procedure): Observable<Procedure> {
    // Mock data or actual HTTP call
    console.log('Adding procedure:', procedure);
    const newProcedure = { ...procedure, procedureId: this.procedures.length + 1 };
    this.procedures.push(newProcedure);
    return of(newProcedure);
  }

  deleteProcedure(identifier: number | string): Observable<any> {
    // Mock data or actual HTTP call
    console.log('Deleting procedure with identifier:', identifier);
    this.procedures = this.procedures.filter(p => p.procedureId !== identifier && p.procedureCode !== identifier);
    return of({});
  }
} 