import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';

export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  phone?: string | null;
  position?: string | null;
  status: string;
  roleId?: number | null;
  departmentId?: number | null;
  role?: { id: number; name: string } | null;
  department?: { id: number; name: string } | null;
}

interface StoredSession {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private _storageService = inject(StorageService);

  private _session = signal<StoredSession | null>(this._readFromStorage());

  readonly currentUser = computed<UserPayload | null>(() =>
    this._decodeToken(this._session()?.access_token ?? null),
  );

  private _readFromStorage(): StoredSession | null {
    const stored = this._storageService.get<StoredSession>('auth_token');
    if (!stored || typeof stored !== 'object' || !('access_token' in stored)) return null;
    return stored;
  }

  getSession(): StoredSession | null {
    return this._session();
  }

  setSession(data: StoredSession): void {
    this._storageService.set('auth_token', data);
    this._session.set(data);
  }

  getToken(): string | null {
    return this._session()?.access_token ?? null;
  }

  signOut(): void {
    this._storageService.remove('auth_token');
    this._session.set(null);
  }

  private _decodeToken(token: string | null): UserPayload | null {
    if (!token) return null;
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(b64)) as UserPayload;
    } catch {
      return null;
    }
  }
}
