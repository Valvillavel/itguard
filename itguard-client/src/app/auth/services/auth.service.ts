import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthStateService } from '../shared/auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL;
  private _http = inject(HttpClient);
  private _authState = inject(AuthStateService);

  logIn(email: string, password: string): Observable<{ access_token: string }> {
    return this._http
      .post<{ access_token: string }>(`${this.API_URL}/auth/log-in`, { email, password })
      .pipe(tap((response) => this._authState.setSession(response)));
  }

  signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Observable<{ access_token: string; user: unknown }> {
    // Token intentionally NOT stored — new users start as INACTIVO
    return this._http.post<{ access_token: string; user: unknown }>(
      `${this.API_URL}/auth/sign-up`,
      { email, password, firstName, lastName },
    );
  }

  logout(): void {
    this._authState.signOut();
  }
}
