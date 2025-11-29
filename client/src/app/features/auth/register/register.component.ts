import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, signal } from '@angular/core';
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
import { SnackbarService, UserService } from '@core/services/_barrel';
import { AuthApiService } from '@core/services/api';
import { RegisterRequest } from '@core/services/api/auth/auth-request.interface';

@Component({
  selector: 'app-register.component',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isFormDisabled = signal(false);

  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private authApi: AuthApiService,
    private snackbar: SnackbarService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.minLength(1),
            Validators.maxLength(100),
          ],
        ],
        nickname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        rptPassword: ['', Validators.required],
      },
      { validators: this.isPasswordsMatch } as AbstractControlOptions,
    );
    effect(() => {
      this.user.isAlreadyLoggedIn();
    });
  }

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

      const { email, nickname, password } = this.registerForm.value;
      const req: RegisterRequest = { email, nickname, password };

      this.authApi.register(req).subscribe({
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
