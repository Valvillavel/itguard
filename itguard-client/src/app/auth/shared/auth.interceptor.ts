import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStateService } from './auth-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const token = authState.getToken();
  if (token) {
    return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }));
  }
  return next(req);
};
