import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    try {
      new URL(control.value);
      return null;
    } catch (error) {
      return { invalidUrl: true };
    }
  };
}

export function mustBeNewValue(primalValue: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value !== primalValue) return null;

    return { valueDidntChanged: true };
  };
}
