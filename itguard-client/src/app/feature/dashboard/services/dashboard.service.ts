import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
  users: { total: number; active: number; inactive: number };
  assets: { total: number; byStatus: Record<string, number> };
  licenses: { total: number; active: number; expired: number };
  incidents: { open: number; inReview: number; resolved: number };
  maintenance: { pending: number; inProcess: number; completed: number };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;

  getStats(): Observable<DashboardStats> {
    return this._http.get<DashboardStats>(`${this.API_URL}/dashboard/stats`);
  }
}
