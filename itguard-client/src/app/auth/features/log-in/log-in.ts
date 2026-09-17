import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { logInForm } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink],
  templateUrl: './log-in.html',
  styles: ``,
})
export default class LogIn {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this._formBuilder.group<logInForm>(
    {
      email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
      password: this._formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    }
  );
}
