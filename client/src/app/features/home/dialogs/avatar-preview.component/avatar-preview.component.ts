import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '@core/services/_barrel';

@Component({
  selector: 'app-avatar-preview.component',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './avatar-preview.component.html',
})
export class AvatarPreviewDialog {
  private readonly authService = inject(AuthService);
  avatarUrl = computed(() => {
    const user = this.authService.user();
    if (!user) return '';
    return user.avatar;
  });
}
