import { Component, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '@core/services/_barrel';
import { UserApiService } from '@core/services/api';
import { UserDtoTable, UserRole } from '@shared/models/user.model';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface EditUserDialogData {
  user: UserDtoTable;
  refetch: () => void;
}

@Component({
  selector: 'app-edit-user',
  imports: [MatDialogModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent {
  adminToggleBool = signal<boolean>(false);
  adminToggleDisabled = signal<boolean>(false);

  constructor(
    private snackbar: SnackbarService,
    private api: UserApiService,
    @Inject(MAT_DIALOG_DATA) public dialogData: EditUserDialogData,
  ) {
    this.adminToggleBool.set((dialogData.user.role as string) === 'Admin');
  }

  private changeRole(email: string, role: UserRole) {
    this.api.updateRole({ email, role }).subscribe({
      next: () => {
        this.adminToggleDisabled.set(false);
        this.dialogData.refetch();
      },
      error: () => {
        this.snackbar.open('', 'error');
      },
    });
    return;
  }

  deleteUser = (target: UserDtoTable) => {
    this.snackbar.open(`Are you want to delete user ${target.email}?`, 'error', 'yes', 5000, () => {
      this.api.deleteUser(target.email).subscribe({
        next: () => {
          this.snackbar.open(`${target.email} deleted`, 'success');
          this.dialogData.refetch();
        },
        error: () => {
          this.snackbar.open('', 'error');
        },
      });
    });
  };
  onRoleChange(event: MatSlideToggleChange) {
    const email = this.dialogData.user.email;
    this.adminToggleDisabled.set(true);
    if (!event.checked) this.changeRole(email, 'User');
    else
      this.snackbar.open(
        `You want to enable administration rights for ${email}`,
        'warning',
        'yes',
        5000,
        () => this.changeRole(email, 'Admin'),
        () => {
          event.source.checked = false;
          this.adminToggleBool.set(false);
          this.adminToggleDisabled.set(false);
        },
      );
  }
}
