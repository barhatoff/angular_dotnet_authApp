import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControlOptions,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthApiService } from '@core/services/api';
import { DialogService } from '@core/services/dialog.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { UserUpdateApiService } from '@features/home/api/user-udpate-api.service';
import { UpdatePasswordRequest } from '@features/home/api/user-update-request.interface';
import { FormValidationErrorPipe } from '@shared/pipes/form-validator-error.pipe';

@Component({
  selector: 'app-edit-password.component',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormValidationErrorPipe,
  ],
  templateUrl: './edit-password.component.html',
})
export class EditPasswordDialog {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(UserUpdateApiService);
  private readonly authService = inject(AuthApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(DialogService);

  readonly form = this.fb.group(
    {
      password: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
      }),
      newPassword: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
      }),
      newPasswordRpt: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: this.isPasswordsMatch } as AbstractControlOptions,
  );

  isPasswordsMatch(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const rpt = group.get('newPasswordRpt')?.value;
    const rptControl = group.get('newPasswordRpt');

    if (pass !== rpt) {
      rptControl?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  isWrongPassword(group: FormGroup) {
    const passControl = group.get('password');
    passControl?.setErrors({ wrongPassword: true });
    return { wrongPassword: true };
  }

  changePassword() {
    if (this.form.valid) {
      const { password, newPassword } = this.form.getRawValue();
      const req: UpdatePasswordRequest = {
        password,
        newPassword,
      };

      this.api.updatePassword(req).subscribe({
        next: () => {
          this.dialog.closeAll();
          this.snackbar.open(
            'Password updated successfully. Do you need to logout from all devices and login again?',
            'success',
            'logout',
            5000,
            () => this.authService.revokeAllSessions(),
          );
        },
        error: (e: HttpErrorResponse) => {
          console.log(e);

          if (e.status === 401) this.isWrongPassword(this.form);
          else {
            this.snackbar.open('Unexpected error. Try again', 'error');
            this.dialog.closeAll();
          }
        },
      });
    }
  }
}
