import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { Asset, AssetStatus } from '../shared/models';

export interface CreateAssetPayload {
  inventoryCode: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  operatingSystem?: string;
  osVersion?: string;
  location?: string;
  status?: AssetStatus;
  userId?: string;
  departmentId?: number;
  observations?: string;
  acquisitionDate?: string;
  warrantyExpiration?: string;
}

export interface UpdateAssetPayload extends Partial<CreateAssetPayload> {}

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;

  getAll(): Observable<Asset[]> {
    return this._http
      .get<{ data: Asset[] } | Asset[]>(`${this.API_URL}/assets`)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }

  getById(id: number): Observable<Asset> {
    return this._http.get<Asset>(`${this.API_URL}/assets/${id}`);
  }

  create(data: CreateAssetPayload): Observable<Asset> {
    return this._http.post<Asset>(`${this.API_URL}/assets`, data);
  }

  update(id: number, data: UpdateAssetPayload): Observable<Asset> {
    return this._http.patch<Asset>(`${this.API_URL}/assets/${id}`, data);
  }

  changeStatus(id: number, status: AssetStatus): Observable<Asset> {
    return this._http.patch<Asset>(`${this.API_URL}/assets/${id}/status`, { status });
  }

  assignUser(id: number, userId: string | null): Observable<Asset> {
    return this._http.patch<Asset>(`${this.API_URL}/assets/${id}/assign-user`, { userId });
  }

  assignDepartment(id: number, departmentId: number | null): Observable<Asset> {
    return this._http.patch<Asset>(`${this.API_URL}/assets/${id}/assign-department`, {
      departmentId,
    });
  }

  remove(id: number): Observable<Asset> {
    return this._http.delete<Asset>(`${this.API_URL}/assets/${id}`);
  }
}
