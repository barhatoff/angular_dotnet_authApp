import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SnackbarService, UserService, DialogService } from '@core/services/_barrel';
import { UserApiService } from '@core/services/api';
import {
  UpdateAvatarRequest,
  UpdateNicknameRequest,
} from '@core/services/api/user/user-request.interface';
import { mustBeNewValue, urlValidator } from '@core/utils/validator.util';
import { ApplySqrButtonComponent } from '@shared/components/buttons';
import { UserDto } from '@shared/models/user.model';

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
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileDialog {
  isInputsDisabled = signal(false);
  user = signal<UserDto | null>(null);
  nicknameControl: FormControl;
  avatarControl: FormControl;

  constructor(
    private userService: UserService,
    private api: UserApiService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
  ) {
    const initialUser = userService.user();
    this.user.set(initialUser);

    const initialNickname = initialUser?.nickname ?? '';
    this.nicknameControl = new FormControl(initialNickname, [
      Validators.minLength(3),
      Validators.maxLength(60),
      mustBeNewValue(initialNickname),
    ]);

    const initialAvatar = initialUser?.avatar ?? '';
    this.avatarControl = new FormControl(initialAvatar, [
      urlValidator(),
      mustBeNewValue(initialAvatar),
    ]);
  }

  updateNickname = () => {
    if (this.nicknameControl.valid) {
      this.isInputsDisabled.set(true);
      const req: UpdateNicknameRequest = { nickname: this.nicknameControl.value };
      this.api.updateNickname(req).subscribe({
        next: () => {
          this.snackbar.open('Nickname succesfully updated', 'success');
          this.userService.loadUser();
          this.dialog.closeAll();
          this.isInputsDisabled.set(false);
        },
        error: () => {
          this.snackbar.open('', 'error');
        },
      });
    }
  };
  updateAvatar = () => {
    if (this.avatarControl.valid) {
      this.isInputsDisabled.set(true);
      const req: UpdateAvatarRequest = { avatar: this.avatarControl.value };
      this.api.updateAvatar(req).subscribe({
        next: () => {
          this.snackbar.open('Avatar succesfully updated', 'success');
          this.userService.loadUser();
          this.dialog.closeAll();
          this.isInputsDisabled.set(false);
        },
        error: () => {
          this.snackbar.open('', 'error');
        },
      });
    }
  };
}
