import { Pipe, type PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'appFormValidationError',
  standalone: true,
})
export class FormValidationErrorPipe implements PipeTransform {
  transform(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';

    const errorKeys = Object.keys(errors);
    const firstKey = errorKeys[0];

    const messages: Record<string, string> = {
      email: 'Invalid email',
      maxlength: `Max length — ${errors['maxlength']?.requiredLength} symb.`,
      min: `Min number: ${errors['min']?.min}`,
      minlength: `Min length — ${errors['minlength']?.requiredLength} symb.`,
      pattern: 'Invalid data format',
      required: 'Is area is required',
      passwordMismatch: 'Passwords mismatch',
      wrongPassword: 'Wrong password',
      valueDidntChanged: 'Value didnt changed',
    };

    return messages[firstKey] || 'Validation error';
  }
}
