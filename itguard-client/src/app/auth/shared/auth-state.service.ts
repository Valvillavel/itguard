import { inject, Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

interface Session {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private _storageService = inject(StorageService);

  constructor() {}

  getSession(): Session | null {
    let currentSession: Session | null = null;
    currentSession = this._storageService.get<Session>('session');
    return currentSession;
  }

  private _isValidSession(maybeSession: Session) {
    return (
      typeof maybeSession === 'object' && maybeSession !== null && 'token' in maybeSession
    );
  }
}