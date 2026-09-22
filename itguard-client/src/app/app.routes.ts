import { Routes } from '@angular/router';
import { privateGuard, publicGuard, roleGuard } from './auth/shared/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard()],
    loadChildren: () => import('./auth/shell/auth.routes'),
  },
  {
    path: '',
    canActivate: [privateGuard()],
    loadComponent: () => import('./feature/shell/shell'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./feature/dashboard/components/dashboard/dashboard'),
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard(['ADMINISTRADOR_TI'])],
        loadComponent: () => import('./feature/users/users'),
      },
      {
        path: 'departamentos',
        canActivate: [roleGuard(['ADMINISTRADOR_TI', 'GERENCIA'])],
        loadComponent: () => import('./feature/departments/departments'),
      },
      {
        path: 'activos',
        loadComponent: () => import('./feature/assets/assets'),
      },
      {
        path: 'componentes',
        loadComponent: () => import('./feature/hardware-components/hardware-components'),
      },
      {
        path: 'software',
        loadComponent: () => import('./feature/software/software'),
      },
      {
        path: 'licencias',
        canActivate: [roleGuard(['ADMINISTRADOR_TI'])],
        loadComponent: () => import('./feature/licenses/licenses'),
      },
      {
        path: 'asignaciones',
        canActivate: [roleGuard(['ADMINISTRADOR_TI'])],
        loadComponent: () => import('./feature/license-assignments/license-assignments-fe'),
      },
      {
        path: 'software-instalado',
        loadComponent: () => import('./feature/installed-software/installed-software-fe'),
      },
      {
        path: 'mantenimientos',
        loadComponent: () => import('./feature/maintenance/maintenance'),
      },
      {
        path: 'incidentes',
        loadComponent: () => import('./feature/incidents/incidents'),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./feature/profile/profile'),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
