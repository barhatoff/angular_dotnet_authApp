import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog.component',
  imports: [MatDialogModule],
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  readonly dialogData = inject<HttpErrorResponse>(MAT_DIALOG_DATA);

  readonly parsedError = signal(JSON.stringify(this.dialogData.error));
}
