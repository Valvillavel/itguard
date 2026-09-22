import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HardwareComponent {
  id: number; assetId: number; type: string; brand?: string | null; model?: string | null;
  serialNumber?: string | null; capacity?: string | null; status?: string | null;
  installationDate?: string | null; removalDate?: string | null; observations?: string | null;
  createdAt: string; updatedAt: string;
  asset?: { id: number; name: string; inventoryCode: string } | null;
}
export interface CreateHWPayload { assetId: number; type: string; brand?: string; model?: string; serialNumber?: string; capacity?: string; status?: string; observations?: string; }
export interface UpdateHWPayload extends Partial<Omit<CreateHWPayload, 'assetId'>> {}

@Injectable({ providedIn: 'root' })
export class HardwareComponentsService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;
  getAll(): Observable<HardwareComponent[]> { return this._http.get<HardwareComponent[]>(`${this.API_URL}/hardware-components`); }
  getById(id: number): Observable<HardwareComponent> { return this._http.get<HardwareComponent>(`${this.API_URL}/hardware-components/${id}`); }
  create(data: CreateHWPayload): Observable<HardwareComponent> { return this._http.post<HardwareComponent>(`${this.API_URL}/hardware-components`, data); }
  update(id: number, data: UpdateHWPayload): Observable<HardwareComponent> { return this._http.patch<HardwareComponent>(`${this.API_URL}/hardware-components/${id}`, data); }
  remove(id: number): Observable<HardwareComponent> { return this._http.delete<HardwareComponent>(`${this.API_URL}/hardware-components/${id}`); }
}
