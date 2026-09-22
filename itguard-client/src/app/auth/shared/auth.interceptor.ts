import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from './auth-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const token = authState.getToken();

  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Token expirado o inválido: limpiar sesión y redirigir
      if (error.status === 401 && !req.url.includes('/auth/log-in')) {
        authState.signOut();
        router.navigate(['/auth/log-in']);
      }
      return throwError(() => error);
    }),
  );
};
