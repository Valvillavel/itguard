import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { User, Asset, Incident, Maintenance } from '../interfaces/users';
import type { DashboardStats } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;

  getStats(): Observable<DashboardStats> {
    return forkJoin({
      users: this._http.get<User[]>(`${this.API_URL}/users`),
      assets: this._http.get<Asset[]>(`${this.API_URL}/assets`),
      incidents: this._http.get<Incident[]>(`${this.API_URL}/incidents`),
      maintenance: this._http.get<Maintenance[]>(`${this.API_URL}/maintenance`),
    }).pipe(
      map((data) => ({
        totalUsers: data.users.length,
        totalAssets: data.assets.length,
        openIncidents: data.incidents.filter((i) => i.status === 'ABIERTO').length,
        pendingMaintenance: data.maintenance.filter((m) => m.status === 'PENDIENTE').length,
      })),
    );
  }
}
