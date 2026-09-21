import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { logInForm } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './log-in.html',
  styles: ``,
})
export default class LogIn {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false); // 👈 agregado aquí

  form = this._formBuilder.group<logInForm>({
    email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
    password: this._formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }

  loginAccount(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this._authService.logIn(email, password).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading.set(false);
        this._router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(err));
      },
    });
  }

  private getErrorMessage(err: unknown): string {
    const e = err as { status?: number; error?: { message?: string } };
    if (e?.status === 400) return e?.error?.message ?? 'Email o contraseña incorrectos.';
    if (e?.status === 401) return 'Correo o contraseña incorrectos.';
    if (e?.status === 404) return 'No existe una cuenta con ese correo.';
    if (e?.status === 0) return 'No se pudo conectar con el servidor. Intenta más tarde.';
    return 'Ocurrió un error al iniciar sesión. Intenta de nuevo.';
  }
}
