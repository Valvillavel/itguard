import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

export const privateGuard = (): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);
    if (!authState.getSession()) {
      router.navigate(['/auth/log-in']);
      return false;
    }
    return true;
  };
};

export const publicGuard = (): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);
    if (authState.getSession()) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  };
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);
    const user = authState.currentUser();
    if (!user) {
      router.navigate(['/auth/log-in']);
      return false;
    }
    const roleName = user.role?.name;
    if (!roleName || !allowedRoles.includes(roleName)) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  };
};
