import { Component } from '@angular/core';
import { UserService, DialogService } from '@core/services/_barrel';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AvatarPreviewDialog, EditPasswordDialog, EditProfileDialog } from './dialogs';
@Component({
  selector: 'app-home.component',
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    public userService: UserService,
    private dialog: DialogService,
  ) {}

  viewAvatar() {
    this.dialog.open(AvatarPreviewDialog);
  }
  changeAvatar() {
    this.dialog.open(EditProfileDialog);
  }
  changePassword() {
    this.dialog.open(EditPasswordDialog);
  }
}
