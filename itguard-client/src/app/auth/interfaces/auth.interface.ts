import { FormControl } from '@angular/forms';

export interface signUpForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmpass: FormControl<string>;
}

export interface logInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}
