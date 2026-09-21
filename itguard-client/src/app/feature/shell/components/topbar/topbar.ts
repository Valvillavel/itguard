import { Component, inject, output, signal, computed, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../../auth/shared/auth-state.service';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
})
export default class Topbar {
  private _authState = inject(AuthStateService);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  menuToggle = output<void>();
  userMenuOpen = signal(false);

  readonly user = computed(() => this._authState.currentUser());

  readonly userInitials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
  });

  readonly userName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/auth/log-in']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-user-menu]')) {
      this.userMenuOpen.set(false);
    }
  }
}
