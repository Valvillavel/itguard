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

  signOut(): void {
    this._storageService.remove('auth_token');
  }

  getSession(): Session | null {
    let currentSession: Session | null = null;
    
    currentSession = this._storageService.get<Session>('auth_token');
    
    const maybeSession = this._storageService.get<Session>('auth_token')
    
    if (maybeSession!== null){
        if(this._isValidSession(maybeSession)){
            currentSession = maybeSession;
        }else{
            this.signOut()
        }
    }
     return currentSession;
  }

  private _isValidSession(maybeSession: Session) {
    return (
      typeof maybeSession === 'object' && maybeSession !== null && 'token' in maybeSession
    );
  }
}