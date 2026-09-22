import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LicenseAssignmentItem {
  id: number; licenseId: number; assetId?: number | null; userId?: string | null; assignedById?: string | null;
  assignedAt: string; unassignedAt?: string | null; status?: string | null; observations?: string | null;
  createdAt: string; updatedAt: string;
  license?: { id: number; licenseType: string; software?: { id: number; name: string } | null } | null;
  user?: { id: string; firstName: string; lastName: string; email: string } | null;
  assignedBy?: { id: string; firstName: string; lastName: string; email: string } | null;
}

@Injectable({ providedIn: 'root' })
export class LicenseAssignmentsFeService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;
  getAll(): Observable<LicenseAssignmentItem[]> { return this._http.get<LicenseAssignmentItem[]>(`${this.API_URL}/license-assignments`); }
  getById(id: number): Observable<LicenseAssignmentItem> { return this._http.get<LicenseAssignmentItem>(`${this.API_URL}/license-assignments/${id}`); }
  create(data: { licenseId: number; assetId?: number; userId?: string; assignedById?: string; observations?: string }): Observable<LicenseAssignmentItem> { return this._http.post<LicenseAssignmentItem>(`${this.API_URL}/license-assignments`, data); }
  unassign(id: number, data?: { observations?: string }): Observable<LicenseAssignmentItem> { return this._http.patch<LicenseAssignmentItem>(`${this.API_URL}/license-assignments/${id}/unassign`, data ?? {}); }
  remove(id: number): Observable<LicenseAssignmentItem> { return this._http.delete<LicenseAssignmentItem>(`${this.API_URL}/license-assignments/${id}`); }
}
