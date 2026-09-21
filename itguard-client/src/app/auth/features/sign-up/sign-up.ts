import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { signUpForm } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../../shared/password-match.validator';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styles: ``,
})
export default class SignUp {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  form = this._formBuilder.group<signUpForm>(
    {
      firstName: this._formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: this._formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
      password: this._formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmpass: this._formBuilder.nonNullable.control('', [Validators.required]),
    },
    { validators: passwordMatchValidator() },
  );

  get firstName() {
    return this.form.controls.firstName;
  }
  get lastName() {
    return this.form.controls.lastName;
  }
  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirmpass() {
    return this.form.controls.confirmpass;
  }

  get passwordsMismatch(): boolean {
    return (
      this.form.hasError('passwordMismatch') && (this.confirmpass.touched || this.confirmpass.dirty)
    );
  }

  saveAccount(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, firstName, lastName } = this.form.getRawValue();

    this._authService.signUp(email, password, firstName, lastName).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(
          'Cuenta creada exitosamente. Podrás iniciar sesión una vez que un administrador active tu cuenta.',
        );
        setTimeout(() => this._router.navigate(['/auth/log-in']), 4000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(err));
      },
    });
  }

  private getErrorMessage(err: unknown): string {
    const e = err as { status?: number; error?: { message?: string } };
    if (e?.status === 400) return e?.error?.message ?? 'Datos inválidos. Verifica el formulario.';
    if (e?.status === 409) return 'Este correo ya está registrado.';
    if (e?.status === 0) return 'No se pudo conectar con el servidor. Intenta más tarde.';
    return 'Ocurrió un error al crear la cuenta. Intenta de nuevo.';
  }
}
