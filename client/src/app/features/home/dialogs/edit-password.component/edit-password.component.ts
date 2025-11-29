import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SnackbarService, AuthService, DialogService } from '@core/services/_barrel';
import { UserApiService } from '@core/services/api';
import { UpdatePasswordRequest } from '@core/services/api/user/user-request.interface';

@Component({
  selector: 'app-edit-password.component',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-password.component.html',
})
export class EditPasswordDialog {
  changingPassword: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: UserApiService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
  ) {
    this.changingPassword = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        newPassword: [
          '',
          [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
        ],
        newPasswordRpt: ['', [Validators.required]],
      },
      { validators: this.isPasswordsMatch } as AbstractControlOptions,
    );
  }

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
    if (this.changingPassword.valid) {
      const { password, newPassword } = this.changingPassword.value;
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

          if (e.status === 401) this.isWrongPassword(this.changingPassword);
          else {
            this.snackbar.open('Unexpected error. Try again', 'error');
            this.dialog.closeAll();
          }
        },
      });
    }
  }
}
