import { Component, computed, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '@core/services/snackbar.service';
import { UserDtoTable, UserRole } from '@shared/models';
import { AdminUserApiService } from '../api/admin-user-api.service';
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
  private readonly snackbar = inject(SnackbarService);
  private readonly api = inject(AdminUserApiService);

  readonly adminToggleBool = computed(() => {
    const role = this.dialogData.user.role as string;
    return role === 'Admin';
  });
  readonly adminToggleDisabled = signal<boolean>(false);
  readonly dialogData = inject<EditUserDialogData>(MAT_DIALOG_DATA);

  private changeRole(id: string, role: UserRole) {
    this.api.updateRole(id, { role }).subscribe({
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
      this.api.deleteUser(target.id).subscribe({
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
    const id = this.dialogData.user.id;

    this.adminToggleDisabled.set(true);
    if (!event.checked) this.changeRole(id, 'User');
    else
      this.snackbar.open(
        `You want to enable administration rights for ${email}`,
        'warning',
        'yes',
        5000,
        () => this.changeRole(id, 'Admin'),
        () => {
          event.source.checked = false;
          this.adminToggleDisabled.set(false);
        },
      );
  }
}
