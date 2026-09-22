import { Component, inject, input, output, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../../../auth/shared/auth-state.service';

interface NavItem {
  label: string;
  route: string;
  roles?: string[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ label: 'Dashboard', route: '/dashboard' }],
  },
  {
    title: 'GESTIÓN',
    items: [
      { label: 'Usuarios', route: '/usuarios', roles: ['ADMINISTRADOR_TI'] },
      { label: 'Departamentos', route: '/departamentos', roles: ['ADMINISTRADOR_TI', 'GERENCIA'] },
    ],
  },
  {
    title: 'ACTIVOS',
    items: [
      { label: 'Activos', route: '/activos' },
      { label: 'Componentes', route: '/componentes' },
      { label: 'Software', route: '/software' },
      { label: 'S. Instalado', route: '/software-instalado' },
      { label: 'Licencias', route: '/licencias', roles: ['ADMINISTRADOR_TI'] },
      { label: 'Asignaciones', route: '/asignaciones', roles: ['ADMINISTRADOR_TI'] },
    ],
  },
  {
    title: 'SOPORTE',
    items: [
      { label: 'Mantenimientos', route: '/mantenimientos' },
      { label: 'Incidentes', route: '/incidentes' },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export default class Sidebar {
  private _authState = inject(AuthStateService);

  isOpen = input<boolean>(false);
  closeEvent = output<void>();

  readonly userRole = computed(() => this._authState.currentUser()?.role?.name ?? null);

  readonly sections = computed<NavSection[]>(() => {
    const role = this.userRole();
    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || (role !== null && item.roles.includes(role)),
      ),
    })).filter((section) => section.items.length > 0);
  });
}
