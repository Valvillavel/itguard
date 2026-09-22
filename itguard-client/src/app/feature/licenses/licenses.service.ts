import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type LicenseStatus = 'ACTIVA' | 'VENCIDA' | 'SUSPENDIDA' | 'DISPONIBLE';
export interface License {
  id: number;
  softwareId: number;
  licenseType: string;
  reference?: string | null;
  purchasedQuantity: number;
  usedQuantity: number;
  purchaseDate?: string | null;
  activationDate?: string | null;
  expirationDate?: string | null;
  provider?: string | null;
  cost?: string | null;
  status: LicenseStatus;
  observations?: string | null;
  createdAt: string;
  updatedAt: string;
  software?: { id: number; name: string } | null;
}
export interface CreateLicensePayload {
  softwareId: number;
  licenseType: string;
  purchasedQuantity: number;
  reference?: string;
  expirationDate?: string;
  provider?: string;
  cost?: number;
  observations?: string;
}
export interface UpdateLicensePayload extends Partial<CreateLicensePayload> {
  status?: LicenseStatus;
  usedQuantity?: number;
}

@Injectable({ providedIn: 'root' })
export class LicensesService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;
  getAll(): Observable<License[]> {
    return this._http
      .get<{ data: License[] } | License[]>(`${this.API_URL}/licenses`)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }
  getById(id: number): Observable<License> {
    return this._http.get<License>(`${this.API_URL}/licenses/${id}`);
  }
  create(data: CreateLicensePayload): Observable<License> {
    return this._http.post<License>(`${this.API_URL}/licenses`, data);
  }
  update(id: number, data: UpdateLicensePayload): Observable<License> {
    return this._http.patch<License>(`${this.API_URL}/licenses/${id}`, data);
  }
  remove(id: number): Observable<License> {
    return this._http.delete<License>(`${this.API_URL}/licenses/${id}`);
  }
}
