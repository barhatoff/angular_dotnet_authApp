import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { SnackbarService, AuthService } from '@core/services/_barrel';
import { LoginRequest } from '@core/services/api/auth/auth-request.interface';
import { FormValidationErrorPipe } from '@shared/pipes/form-validator-error.pipe';

@Component({
  selector: 'app-login.component',
  imports: [
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
    RouterModule,
    FormValidationErrorPipe,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);

  isFormDisabled = signal(false);
  readonly loginForm = this.fb.group({
    email: this.fb.control('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(100),
      ],
    }),
    password: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
    }),
  });
  private readonly authCheck = effect(() => {
    this.authService.isAlreadyLoggedIn();
  });

  login(): void {
    if (this.loginForm.valid) {
      this.isFormDisabled.set(true);

      const { email, password } = this.loginForm.getRawValue();
      const req: LoginRequest = { email, password };

      this.authService.login(req).subscribe({
        next: () => {
          this.snackbar.open('Login successful. Redirecting to home', 'success');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        },
        error: () => {
          this.isFormDisabled.set(false);
          this.snackbar.open('Wrong email or password. Try again', 'error');
        },
      });
    } else this.snackbar.open('Validation failed. Try again', 'error');
  }
}
