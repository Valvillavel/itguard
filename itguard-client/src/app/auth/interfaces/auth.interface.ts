import { FormControl } from "@angular/forms";

export interface signUpForm{
    email: FormControl<string>,
    password: FormControl<string>,
    confirmpass:FormControl<string>
}
export interface logInForm{
    email: FormControl<string>,
    password: FormControl<string>,
}