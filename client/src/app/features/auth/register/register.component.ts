import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '@core/services/api';
import { RegisterRequest } from '@core/services/api/auth/auth-request.interface';
import { AuthService } from '@core/services/auth.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { FormValidationErrorPipe } from '@shared/pipes/form-validator-error.pipe';

@Component({
  selector: 'app-register.component',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    FormValidationErrorPipe,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);

  isFormDisabled = signal(false);

  readonly registerForm = this.fb.group(
    {
      email: this.fb.control('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      }),
      nickname: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(60)],
      }),
      password: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
      }),
      rptPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: this.isPasswordsMatch } as AbstractControlOptions,
  );
  private readonly authCheck = effect(() => {
    this.authService.isAlreadyLoggedIn();
  });

  isPasswordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const rpt = group.get('rptPassword')?.value;
    const rptControl = group.get('rptPassword');

    if (pass !== rpt) {
      rptControl?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  register() {
    if (this.registerForm.valid) {
      this.isFormDisabled.set(true);

      const { email, nickname, password } = this.registerForm.getRawValue();
      const req: RegisterRequest = { email, nickname, password };

      this.api.register(req).subscribe({
        next: () => {
          this.snackbar.open('Register successful. Redirecting to login', 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (e: HttpErrorResponse) => {
          this.isFormDisabled.set(false);
          this.snackbar.open(`${e.error?.message ?? 'Unexpected error'}`, 'error');
        },
      });
    } else this.snackbar.open('Validation failed. Try again', 'error');
  }
}
