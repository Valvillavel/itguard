import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/shell/auth.routes'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./feature/dashboard/dashboard'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
