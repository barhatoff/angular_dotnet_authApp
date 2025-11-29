import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { UserService } from '@core/services/_barrel';

@Component({
  selector: 'app-avatar-preview.component',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './avatar-preview.component.html',
})
export class AvatarPreviewDialog {
  avatarUrl = signal<string | null>(null);
  constructor(private userService: UserService) {
    const user = this.userService.user();
    this.avatarUrl.set(user?.avatar ?? '');
  }
}
