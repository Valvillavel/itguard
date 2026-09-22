import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SoftwareItem {
  id: number;
  name: string;
  manufacturer?: string | null;
  category?: string | null;
  currentVersion?: string | null;
  requiresLicense: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CreateSoftwarePayload {
  name: string;
  manufacturer?: string;
  category?: string;
  currentVersion?: string;
  requiresLicense?: boolean;
}
export interface UpdateSoftwarePayload extends Partial<CreateSoftwarePayload> {
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SoftwareService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;
  getAll(): Observable<SoftwareItem[]> {
    return this._http
      .get<{ data: SoftwareItem[] } | SoftwareItem[]>(`${this.API_URL}/software`)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }
  getById(id: number): Observable<SoftwareItem> {
    return this._http.get<SoftwareItem>(`${this.API_URL}/software/${id}`);
  }
  create(data: CreateSoftwarePayload): Observable<SoftwareItem> {
    return this._http.post<SoftwareItem>(`${this.API_URL}/software`, data);
  }
  update(id: number, data: UpdateSoftwarePayload): Observable<SoftwareItem> {
    return this._http.patch<SoftwareItem>(`${this.API_URL}/software/${id}`, data);
  }
  deactivate(id: number): Observable<SoftwareItem> {
    return this._http.delete<SoftwareItem>(`${this.API_URL}/software/${id}`);
  }
  activate(id: number): Observable<SoftwareItem> {
    return this._http.patch<SoftwareItem>(`${this.API_URL}/software/${id}`, { active: true });
  }
}
