import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly DEFAULT_CONFIG: MatDialogConfig = {
    width: '500px',
    maxWidth: '90vw',
    hasBackdrop: true,
    disableClose: false,
    autoFocus: false,
  };

  constructor(private matDialog: MatDialog) {}

  open<T, D = any, R = any>(
    component: ComponentType<T>,
    data?: D,
    config?: MatDialogConfig<D>,
  ): MatDialogRef<T, R> {
    const finalConfig: MatDialogConfig<D> = {
      ...this.DEFAULT_CONFIG,
      ...config,

      data: data || config?.data,
    };

    return this.matDialog.open(component, finalConfig);
  }

  closeAll() {
    this.matDialog.closeAll();
  }

  onClose<T, R = any>(dialogRef: MatDialogRef<T, R>): Observable<R | undefined> {
    return dialogRef.afterClosed();
  }
}
