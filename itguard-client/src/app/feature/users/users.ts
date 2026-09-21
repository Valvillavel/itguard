import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from './users.service';
import type { Role, User } from '../shared/models';

interface ConfirmDialog {
  message: string;
  action: () => void;
}

interface EditForm {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  position: string;
  departmentId: string;
  roleId: string;
}

@Component({
  selector: 'app-users',
  imports: [FormsModule],
  templateUrl: './users.html',
})
export default class Users implements OnInit {
  private _usersService = inject(UsersService);

  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  searchTerm = signal('');
  statusFilter = signal<'all' | 'ACTIVO' | 'INACTIVO'>('all');
  roleFilter = signal<string>('all');

  confirmDialog = signal<ConfirmDialog | null>(null);
  editingUser = signal<User | null>(null);
  editForm = signal<EditForm>({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    position: '',
    departmentId: '',
    roleId: '',
  });
  editLoading = signal(false);

  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const role = this.roleFilter();
    return this.users().filter((u) => {
      const matchesSearch =
        !term ||
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.username?.toLowerCase().includes(term) ?? false);
      const matchesStatus = status === 'all' || u.status === status;
      const matchesRole = role === 'all' || u.role?.name === role;
      return matchesSearch && matchesStatus && matchesRole;
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this._usersService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los usuarios.');
        this.isLoading.set(false);
      },
    });
    this._usersService.getRoles().subscribe({
      next: (roles) => this.roles.set(roles),
    });
  }

  openConfirm(message: string, action: () => void): void {
    this.confirmDialog.set({ message, action });
  }

  runConfirm(): void {
    this.confirmDialog()?.action();
    this.confirmDialog.set(null);
  }

  toggleStatus(user: User): void {
    const isActive = user.status === 'ACTIVO';
    const action = isActive ? 'desactivar' : 'activar';
    this.openConfirm(
      `¿Está seguro de ${action} al usuario ${user.firstName} ${user.lastName}?`,
      () => {
        const req = isActive
          ? this._usersService.deactivate(user.id)
          : this._usersService.activate(user.id);
        req.subscribe({
          next: (updated) => {
            this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
            this.showSuccess(`Usuario ${isActive ? 'desactivado' : 'activado'} correctamente.`);
          },
          error: () => this.showSuccess('Error al actualizar el estado del usuario.'),
        });
      },
    );
  }

  openEdit(user: User): void {
    this.editingUser.set(user);
    this.editForm.set({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username ?? '',
      phone: user.phone ?? '',
      position: user.position ?? '',
      departmentId: user.departmentId?.toString() ?? '',
      roleId: user.roleId?.toString() ?? '',
    });
  }

  saveEdit(): void {
    const user = this.editingUser();
    if (!user) return;
    this.editLoading.set(true);
    const form = this.editForm();
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username || undefined,
      phone: form.phone || undefined,
      position: form.position || undefined,
      roleId: form.roleId ? Number(form.roleId) : undefined,
    };
    this._usersService.update(user.id, payload).subscribe({
      next: (updated) => {
        this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        this.editingUser.set(null);
        this.editLoading.set(false);
        this.showSuccess('Usuario actualizado correctamente.');
      },
      error: () => {
        this.editLoading.set(false);
      },
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3500);
  }
}
