import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmpass = control.get('confirmpass')?.value;

    if (!password || !confirmpass) return null;

    return password === confirmpass ? null : { passwordMismatch: true };
  };
}
