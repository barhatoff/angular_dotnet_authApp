import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from './dialog.service';
import { ErrorDialogComponent } from '@shared/dialogs';

export type SnackbarType = 'success' | 'error' | 'warning' | 'default';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly _snackbar = inject(MatSnackBar);
  private readonly _dialog = inject(DialogService);

  open(
    message: string,
    type: SnackbarType = 'default',
    actionTitle: string = 'Okay',
    duration: number = 3000,
    onAction?: () => void,
    onClose?: () => void,
  ) {
    let dismissByClickOnAction = false;
    const panelClass = type !== 'default' ? [`snackbar-${type}`] : undefined;
    const snackRef = this._snackbar.open(message, actionTitle, {
      duration,
      verticalPosition: 'top',
      panelClass,
    });

    if (onAction) {
      snackRef.onAction().subscribe(() => {
        dismissByClickOnAction = true;
        onAction();
      });
    }

    if (onClose) {
      snackRef.afterDismissed().subscribe(() => {
        if (!dismissByClickOnAction) onClose();
      });
    }
  }

  openError(e: HttpErrorResponse) {
    this.open(`[HTTP ${e.status}] Error :(`, 'error', 'details', 3000, () =>
      this._dialog.open(ErrorDialogComponent, e),
    );
  }
}
