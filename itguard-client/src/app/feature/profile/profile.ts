import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../auth/shared/auth-state.service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
})
export default class Profile implements OnInit {
  private _authState = inject(AuthStateService);
  private _usersService = inject(UsersService);

  readonly currentUser = computed(() => this._authState.currentUser());

  isEditing = signal(false);
  isSaving = signal(false);
  successMessage = signal<string | null>(null);

  form = signal({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    position: '',
  });

  ngOnInit(): void {
    const user = this.currentUser();
    if (user) {
      this.form.set({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username ?? '',
        phone: user.phone ?? '',
        position: user.position ?? '',
      });
    }
  }

  startEdit(): void {
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    const user = this.currentUser();
    if (user) {
      this.form.set({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username ?? '',
        phone: user.phone ?? '',
        position: user.position ?? '',
      });
    }
  }

  save(): void {
    const user = this.currentUser();
    if (!user) return;
    this.isSaving.set(true);
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
          setTimeout(() => this.successMessage.set(null), 4000);
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }
}
