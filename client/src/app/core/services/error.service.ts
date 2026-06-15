import { inject, Injectable, signal } from '@angular/core';
import { throwError } from 'rxjs';
import { AppError } from '@shared/models';
import { SnackbarService } from './_barrel';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly _criticalError = signal<AppError | null>(null);
  private readonly _snackbar = inject(SnackbarService);

  // api/whoim always returning 401 on this paths
  private ignorePaths = [
    { code: 401, path: '/login' },
    { code: 401, path: '/register' },
  ];
  private criticalErrorsCode = [401, 404, 500];
  private errorMessages: Record<number, AppError> = {
    400: {
      code: 400,
      message: 'Неправильний запит.',
    },
    401: {
      code: 401,
      instructions: 'Log in',
      linkTo: '/login',
      message: 'You are unathorized. Please, log in',
    },
    403: {
      code: 403,
      instructions: 'To home',
      linkTo: '/',
      message: 'Forbidden',
    },
    404: {
      code: 404,
      instructions: 'To home',
      linkTo: '/',
      message: 'Page not found',
    },
    500: {
      code: 500,
      instructions: 'To home',
      linkTo: '/',
      message: 'Error on server side. Please refresh or try again later.',
    },
  };

  // PUBLIC METHODS
  get criticalError() {
    return this._criticalError;
  }

  setError(err: AppError, throwCritical?: boolean) {
    if (this.ignorePaths.some((i) => i.code === err.code && i.path === window.location.pathname))
      return;

    if (throwCritical || this.criticalErrorsCode.some((v) => v === err.code))
      this._criticalError.set(err);
    else
      this._snackbar.open(err.message, 'error', err.instructions, 5000, () => {
        if (err.linkTo) window.location.href = err.linkTo;
      });
  }

  setErrorByCode(code: number) {
    this.setError(this.getAppErrorByCode(code));
  }
  getAppErrorByCode(code: number): AppError {
    return this.errorMessages[code] ?? this.errorMessages[500];
  }

  clear() {
    this.criticalError.set(null);
  }
  throwSessionExpired(e: unknown) {
    this.setError({
      code: 401,
      instructions: 'Please log in again.',
      linkTo: '/login',
      message: 'Session expired.',
    });
    return throwError(() => e);
  }
}
