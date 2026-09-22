import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Department } from '../shared/models';

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
  active?: boolean;
}

export interface UpdateDepartmentPayload {
  name?: string;
  description?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;

  getAll(): Observable<Department[]> {
    return this._http.get<Department[]>(`${this.API_URL}/departments`);
  }

  getById(id: number): Observable<Department> {
    return this._http.get<Department>(`${this.API_URL}/departments/${id}`);
  }

  create(data: CreateDepartmentPayload): Observable<Department> {
    return this._http.post<Department>(`${this.API_URL}/departments`, data);
  }

  update(id: number, data: UpdateDepartmentPayload): Observable<Department> {
    return this._http.patch<Department>(`${this.API_URL}/departments/${id}`, data);
  }

  // DELETE /departments/:id — el backend internamente fija active=false
  deactivate(id: number): Observable<Department> {
    return this._http.delete<Department>(`${this.API_URL}/departments/${id}`);
  }

  // PATCH /departments/:id con { active: true }
  activate(id: number): Observable<Department> {
    return this._http.patch<Department>(`${this.API_URL}/departments/${id}`, { active: true });
  }
}
