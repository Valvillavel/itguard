import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Users } from '../interfaces/users';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private _http = inject(HttpClient);
  private API_URL = environment.API_URL;

  getUsers():Observable<Users[]>{
    return this._http.get(`${this.API_URL}/auth/users`).pipe(
      map((reponse)=> reponse as Users[])
    );
  }
}
