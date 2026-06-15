import { Component, computed, inject } from '@angular/core';
import { DialogService, AuthService } from '@core/services/_barrel';
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
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(DialogService);

  readonly user = computed(() => {
    return this.authService.user();
  });

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
