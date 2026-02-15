import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const matchPasswords: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const conformPassword = control.get('confirmPassword');

  if (password?.value !== conformPassword?.value) {
    return { passwordMismatch: true };
  }

  return null;
};
