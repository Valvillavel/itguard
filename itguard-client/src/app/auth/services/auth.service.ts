import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { StorageService } from "../shared/storage.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL;
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  constructor() {}

  signUp(email:string, password:string): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/auth/sign-up`, { 
      email, 
      password }).pipe(tap((response) => {
      this._storage.setItem('auth_token', JSON.stringify(response.token));
    })); 
  }

  logIn(email:string, password:string): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/auth/log-in`, { email, password });
  }
}