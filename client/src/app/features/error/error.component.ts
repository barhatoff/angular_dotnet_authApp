import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ErrorService, SnackbarService } from '@core/services/_barrel';
import { AppError } from '@shared/models/error.model';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-error',
  imports: [CommonModule],
  templateUrl: './error.component.html',
})
export class ErrorComponent {
  errorCodeQuery: string | null = null;
  isPopCatched: boolean = false;
  appError: AppError | null = null;

  constructor(
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private errorService: ErrorService,
  ) {
    this.appError = errorService.error();
    fromEvent(window, 'popstate')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.isPopCatched) return;
        this.isPopCatched = true;

        this.errorService.clear();
        this.snackbar.open('Redirecting to home...', 'success');
        setTimeout(() => (window.location.href = '/'), 1000);
      });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.errorCodeQuery = params.get('code');
      if (this.errorCodeQuery) {
        const codeNumber: number = Number(this.errorCodeQuery);
        this.errorService.setErrorByCode(codeNumber);
      }
    });
  }
}
