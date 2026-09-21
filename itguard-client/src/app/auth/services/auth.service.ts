import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../shared/storage.service';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL;

  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  signUp(email: string, password: string): Observable<AuthResponse> {
    return this._http
      .post<AuthResponse>(`${this.API_URL}/auth/sign-up`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this._storage.set('auth_token', response);
        }),
      );
  }

  logIn(email: string, password: string): Observable<AuthResponse> {
    return this._http
      .post<AuthResponse>(`${this.API_URL}/auth/log-in`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this._storage.set('auth_token', response);
        }),
      );
  }

  getToken(): string | null {
    return this._storage.get<string>('auth_token');
  }

  logout(): void {
    this._storage.remove('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
