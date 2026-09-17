import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './auth/shared/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/shell/auth.routes'),
  },
  {
    path: 'dashboard',
    canActivate: [privateGuard],
    loadComponent: () => import('./feature/dashboard/dashboard'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
