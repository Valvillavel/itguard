import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type IncidentStatus = 'ABIERTO' | 'EN_REVISION' | 'EN_ESPERA' | 'RESUELTO' | 'CERRADO';
export type IncidentPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export interface Incident {
  id: number;
  ticketNumber: string;
  type: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  description: string;
  diagnosis?: string | null;
  solution?: string | null;
  assetId?: number | null;
  userId?: string | null;
  responsibleId?: string | null;
  openedAt: string;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  asset?: { id: number; name: string; inventoryCode: string } | null;
  user?: { id: string; firstName: string; lastName: string; email: string } | null;
  responsible?: { id: string; firstName: string; lastName: string; email: string } | null;
}
export interface CreateIncidentPayload {
  ticketNumber: string;
  type: string;
  description: string;
  priority?: IncidentPriority;
  assetId?: number;
  userId?: string;
  responsibleId?: string;
}
export interface UpdateIncidentPayload {
  type?: string;
  priority?: IncidentPriority;
  status?: IncidentStatus;
  description?: string;
  diagnosis?: string;
  solution?: string;
  responsibleId?: string;
}

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;
  getAll(): Observable<Incident[]> {
    return this._http
      .get<{ data: Incident[] } | Incident[]>(`${this.API_URL}/incidents`)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }
  getById(id: number): Observable<Incident> {
    return this._http.get<Incident>(`${this.API_URL}/incidents/${id}`);
  }
  create(data: CreateIncidentPayload): Observable<Incident> {
    return this._http.post<Incident>(`${this.API_URL}/incidents`, data);
  }
  update(id: number, data: UpdateIncidentPayload): Observable<Incident> {
    return this._http.patch<Incident>(`${this.API_URL}/incidents/${id}`, data);
  }
  close(id: number): Observable<Incident> {
    return this._http.patch<Incident>(`${this.API_URL}/incidents/${id}/close`, {});
  }
  remove(id: number): Observable<Incident> {
    return this._http.delete<Incident>(`${this.API_URL}/incidents/${id}`);
  }
}
