import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type MaintenanceType =
  | 'PREVENTIVO'
  | 'CORRECTIVO'
  | 'ACTUALIZACION'
  | 'REEMPLAZO'
  | 'LIMPIEZA'
  | 'DIAGNOSTICO';
export type MaintenanceStatus = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
export interface MaintenanceRecord {
  id: number;
  assetId: number;
  type: MaintenanceType;
  status: MaintenanceStatus;
  date: string;
  description?: string | null;
  diagnosis?: string | null;
  workDone?: string | null;
  technician?: string | null;
  provider?: string | null;
  cost?: string | null;
  result?: string | null;
  observations?: string | null;
  createdAt: string;
  updatedAt: string;
  asset?: { id: number; name: string; inventoryCode: string } | null;
}
export interface CreateMaintenancePayload {
  assetId: number;
  type: MaintenanceType;
  date: string;
  description?: string;
  technician?: string;
  provider?: string;
}
export interface UpdateMaintenancePayload extends Partial<CreateMaintenancePayload> {
  status?: MaintenanceStatus;
  diagnosis?: string;
  workDone?: string;
  result?: string;
  observations?: string;
}

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;
  getAll(): Observable<MaintenanceRecord[]> {
    return this._http
      .get<{ data: MaintenanceRecord[] } | MaintenanceRecord[]>(`${this.API_URL}/maintenance`)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }
  getById(id: number): Observable<MaintenanceRecord> {
    return this._http.get<MaintenanceRecord>(`${this.API_URL}/maintenance/${id}`);
  }
  create(data: CreateMaintenancePayload): Observable<MaintenanceRecord> {
    return this._http.post<MaintenanceRecord>(`${this.API_URL}/maintenance`, data);
  }
  update(id: number, data: UpdateMaintenancePayload): Observable<MaintenanceRecord> {
    return this._http.patch<MaintenanceRecord>(`${this.API_URL}/maintenance/${id}`, data);
  }
  remove(id: number): Observable<MaintenanceRecord> {
    return this._http.delete<MaintenanceRecord>(`${this.API_URL}/maintenance/${id}`);
  }
}
