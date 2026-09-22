import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthStateService } from '../../auth/shared/auth-state.service';
import { UsersService } from '../users/users.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
})
export default class Profile implements OnInit {
  private _authState = inject(AuthStateService);
  private _usersService = inject(UsersService);
  private _http = inject(HttpClient);

  readonly currentUser = computed(() => this._authState.currentUser());

  isEditing = signal(false);
  isSaving = signal(false);

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  form = signal({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    position: '',
  });

  // =========================
  // Cambio de contraseña
  // =========================

  showPasswordForm = signal(false);

  passwordForm = signal({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  passwordLoading = signal(false);
  passwordError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserForm();
  }

  private loadUserForm(): void {
    const user = this.currentUser();

    if (!user) return;

    this.form.set({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username ?? '',
      phone: user.phone ?? '',
      position: user.position ?? '',
    });
  }

  startEdit(): void {
    this.isEditing.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.errorMessage.set(null);

    this.loadUserForm();
  }

  save(): void {
    const user = this.currentUser();

    if (!user) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const f = this.form();

    this._usersService
      .update(user.id, {
        firstName: f.firstName,
        lastName: f.lastName,
        username: f.username || undefined,
        phone: f.phone || undefined,
        position: f.position || undefined,
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isEditing.set(false);

          this.successMessage.set(
            'Perfil actualizado. Vuelve a iniciar sesión para ver los cambios.',
          );

          setTimeout(() => {
            this.successMessage.set(null);
          }, 4000);
        },

        error: (err) => {
          this.isSaving.set(false);

          this.errorMessage.set(err?.error?.message ?? 'Error al actualizar perfil.');

          setTimeout(() => {
            this.errorMessage.set(null);
          }, 4000);
        },
      });
  }

  // =========================
  // Cambio de contraseña
  // =========================

  openPasswordForm(): void {
    this.passwordForm.set({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    this.passwordError.set(null);
    this.showPasswordForm.set(true);
  }

  closePasswordForm(): void {
    this.showPasswordForm.set(false);

    this.passwordForm.set({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    this.passwordError.set(null);
  }

  submitChangePassword(): void {
    const f = this.passwordForm();

    // Validaciones
    if (!f.currentPassword || !f.newPassword || !f.confirmPassword) {
      this.passwordError.set('Todos los campos son obligatorios.');
      return;
    }

    if (f.newPassword !== f.confirmPassword) {
      this.passwordError.set('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    if (f.newPassword.length < 8) {
      this.passwordError.set('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    this.passwordLoading.set(true);
    this.passwordError.set(null);

    this._http
      .post<{ message: string }>(`${environment.API_URL}/auth/change-password`, {
        currentPassword: f.currentPassword,
        newPassword: f.newPassword,
      })
      .subscribe({
        next: () => {
          this.passwordLoading.set(false);
          this.showPasswordForm.set(false);

          this.passwordForm.set({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });

          this.successMessage.set('Contraseña cambiada correctamente.');

          setTimeout(() => {
            this.successMessage.set(null);
          }, 4000);
        },

        error: (err) => {
          this.passwordLoading.set(false);

          this.passwordError.set(err?.error?.message ?? 'Error al cambiar la contraseña.');
        },
      });
  }
}
