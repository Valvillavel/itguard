import { Routes } from '@angular/router';

export default [
  {
    path: 'log-in',
    loadComponent: () => import('../features/log-in/log-in'),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('../features/sign-up/sign-up'),
  },
  {
    path: '**',
    redirectTo: 'log-in',
  },
] as Routes;
