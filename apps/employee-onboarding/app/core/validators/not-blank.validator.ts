import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Rejects strings that are empty after trimming, which `Validators.required` lets through. */
export function notBlank(control: AbstractControl): ValidationErrors | null {
  const value: unknown = control.value;
  return typeof value === 'string' && value.length > 0 && value.trim() === ''
    ? { blank: true }
    : null;
}
