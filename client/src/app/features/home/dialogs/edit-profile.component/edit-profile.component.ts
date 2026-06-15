import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService, DialogService, SnackbarService } from '@core/services/_barrel';
import { mustBeNewValue, urlValidator } from '@core/utils/validator.util';
import { UserUpdateApiService } from '@features/home/api/user-udpate-api.service';
import { ApplySqrButtonComponent } from '@shared/components/atoms-ui/buttons';
import { FormValidationErrorPipe } from '@shared/pipes/form-validator-error.pipe';

@Component({
  selector: 'app-change-avatar-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ApplySqrButtonComponent,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormValidationErrorPipe,
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileDialog {
  private readonly authService = inject(AuthService);
  private readonly api = inject(UserUpdateApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(DialogService);
  private readonly fb = inject(FormBuilder);

  readonly isInputsDisabled = signal(false);
  readonly user = computed(() => {
    const user = this.authService.user();

    return user;
  });

  nicknameForm: FormGroup;
  avatarForm: FormGroup;

  constructor() {
    const user = this.user();
    const initialNickname = user?.nickname ?? '';
    this.nicknameForm = this.fb.group({
      nickname: this.fb.control(initialNickname, [
        Validators.minLength(3),
        Validators.maxLength(60),
        mustBeNewValue(initialNickname),
      ]),
    });
    const initialAvatar = user?.avatar ?? '';
    this.avatarForm = this.fb.group({
      avatarUrl: this.fb.control(initialAvatar, [urlValidator(), mustBeNewValue(initialAvatar)]),
    });
  }

  updateNickname = () => {
    if (this.nicknameForm.valid) {
      this.isInputsDisabled.set(true);
      const { nickname } = this.nicknameForm.getRawValue();
      this.api.updateNickname({ nickname }).subscribe({
        next: () => {
          this.snackbar.open('Nickname succesfully updated', 'success');
          this.authService.loadUser();
          this.dialog.closeAll();
        },
        error: () => {
          this.snackbar.open('', 'error');
        },
        complete: () => this.isInputsDisabled.set(false),
      });
    }
  };
  updateAvatar = () => {
    if (this.avatarForm.valid) {
      this.isInputsDisabled.set(true);
      const { avatarUrl } = this.avatarForm.getRawValue();
      this.api.updateAvatar({ avatar: avatarUrl }).subscribe({
        next: () => {
          this.snackbar.open('Avatar succesfully updated', 'success');
          this.authService.loadUser();
          this.dialog.closeAll();
        },
        error: () => {
          this.snackbar.open('', 'error');
        },
        complete: () => this.isInputsDisabled.set(false),
      });
    }
  };
}
