import { Injectable, signal } from '@angular/core';
import { AppError } from '@shared/models/error.model';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly _error = signal<AppError | null>(null);

  // api/whoim always returning 401 on this paths
  private ignorePaths = [
    { code: 401, path: '/login' },
    { code: 401, path: '/register' },
  ];

  private errorMessages: Record<number, AppError> = {
    400: {
      code: 400,
      message: 'Bad Request: The server could not understand the request.',
      instructions: 'Please check your input and try again.',
    },
    401: {
      code: 401,
      message: 'Unauthorized: Access is denied due to invalid credentials.',
      instructions: 'Please log in again.',
      linkTo: '/login',
    },
    403: {
      code: 403,
      message: "Access denied. You don't have permission to access this page.",
      instructions: 'Please go back or return to the home page.',
      linkTo: '/',
    },
    404: {
      code: 404,
      message: 'The requested resource was not found.',
    },
    500: {
      code: 500,
      message: 'An internal server error occurred.',
      instructions: 'Please relode page or try again later',
    },
  };

  get error() {
    return this._error;
  }

  setError(err: AppError) {
    if (this.ignorePaths.some((i) => i.code === err.code && i.path === window.location.pathname))
      return;
    this._error.set(err);
  }
  setErrorByCode(code: number) {
    this.setError(this.getAppErrorByCode(code));
  }

  clear() {
    this._error.set(null);
  }

  getAppErrorByCode(code: number): AppError {
    return this.errorMessages[code] ?? this.errorMessages[500];
  }

  throwSessionExpired(e: any) {
    this.setError({
      code: 401,
      message: 'Session expired.',
      instructions: 'Please log in again.',
      linkTo: '/login',
    });
    return throwError(() => e);
  }
}
