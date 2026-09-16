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

  form = this._formBuilder.group<signUpForm>(
    {
      email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
      password: this._formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmpass: this._formBuilder.nonNullable.control('', [Validators.required]),
    },
    { validators: passwordMatchValidator() },
  );

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

    const { email, password } = this.form.getRawValue();

    this._authService.signUp(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._router.navigate(['/auth/log-in']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(err));
      },
    });
  }

  private getErrorMessage(err: any): string {
    if (err?.status === 409) return 'Este correo ya está registrado.';
    if (err?.status === 0) return 'No se pudo conectar con el servidor. Intenta más tarde.';
    return 'Ocurrió un error al crear la cuenta. Intenta de nuevo.';
  }
}
