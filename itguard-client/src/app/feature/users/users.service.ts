import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { Role, User, UpdateUserPayload } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;

  getAll(): Observable<User[]> {
    return this._http
      .get<{ data: User[] } | User[]>(`${this.API_URL}/users`)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }

  getById(id: string): Observable<User> {
    return this._http.get<User>(`${this.API_URL}/users/${id}`);
  }

  update(id: string, data: UpdateUserPayload): Observable<User> {
    return this._http.patch<User>(`${this.API_URL}/users/${id}`, data);
  }

  activate(id: string): Observable<User> {
    return this._http.patch<User>(`${this.API_URL}/users/${id}`, { status: 'ACTIVO' });
  }

  deactivate(id: string): Observable<User> {
    return this._http.patch<User>(`${this.API_URL}/users/${id}`, { status: 'INACTIVO' });
  }

  changeRole(id: string, roleId: number): Observable<User> {
    return this._http.patch<User>(`${this.API_URL}/users/${id}`, { roleId });
  }

  getRoles(): Observable<Role[]> {
    return this._http.get<Role[]>(`${this.API_URL}/roles`);
  }
}
