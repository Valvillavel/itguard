import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InstalledSoftwareItem {
  id: number; assetId: number; softwareId: number;
  version?: string | null; installedAt?: string | null;
  lastCheck?: string | null; status?: string | null;
  createdAt: string; updatedAt: string;
  asset?: { id: number; name: string; inventoryCode: string } | null;
  software?: { id: number; name: string; manufacturer?: string | null } | null;
}

@Injectable({ providedIn: 'root' })
export class InstalledSoftwareFeService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;
  getAll(): Observable<InstalledSoftwareItem[]> { return this._http.get<InstalledSoftwareItem[]>(`${this.API_URL}/installed-software`); }
  getByAsset(assetId: number): Observable<InstalledSoftwareItem[]> { return this._http.get<InstalledSoftwareItem[]>(`${this.API_URL}/assets/${assetId}/software`); }
  getById(id: number): Observable<InstalledSoftwareItem> { return this._http.get<InstalledSoftwareItem>(`${this.API_URL}/installed-software/${id}`); }
  create(data: { assetId: number; softwareId: number; version?: string; status?: string }): Observable<InstalledSoftwareItem> { return this._http.post<InstalledSoftwareItem>(`${this.API_URL}/installed-software`, data); }
  update(id: number, data: { version?: string; lastCheck?: string; status?: string }): Observable<InstalledSoftwareItem> { return this._http.patch<InstalledSoftwareItem>(`${this.API_URL}/installed-software/${id}`, data); }
  remove(id: number): Observable<InstalledSoftwareItem> { return this._http.delete<InstalledSoftwareItem>(`${this.API_URL}/installed-software/${id}`); }
}
