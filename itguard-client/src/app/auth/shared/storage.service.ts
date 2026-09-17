import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
    private storage: Storage = localStorage;
  constructor() { }

  get<T>(key: string): T | null {
    const item = this.storage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }
}