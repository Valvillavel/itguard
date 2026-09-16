import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL;
  private _http = inject(HttpClient);

  constructor() {}

  signUp(email:string, password:string): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/auth/sign-up`, { email, password });
  }

  logIn(email:string, password:string): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/auth/log-in`, { email, password });
  }
}