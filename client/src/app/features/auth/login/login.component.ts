import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { SnackbarService, UserService, AuthService } from '@core/services/_barrel';
import { LoginRequest } from '@core/services/api/auth/auth-request.interface';

@Component({
  selector: 'app-login.component',
  imports: [
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
    RouterModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isFormDisabled = signal(false);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackbar: SnackbarService,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)],
      ],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    });
    effect(() => {
      this.userService.isAlreadyLoggedIn();
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isFormDisabled.set(true);

      const { email, password } = this.loginForm.value;
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
