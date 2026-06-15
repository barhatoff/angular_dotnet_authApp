import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { IGNORE_ERROR_INTERCEPTOR } from '@core/http/http-tokens';
import { ErrorService } from '@core/services/_barrel';
import { AuthApiService } from '@core/services/api';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private accessToken: string | null = localStorage.getItem('accessToken') ?? null;
  private readonly api = inject(AuthApiService);
  private readonly error = inject(ErrorService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = req;

    // intercepter into each HTTP request and set header: Authorization
    if (this.accessToken) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.accessToken}`),
      });
    }
    // catchError call refreshToken if access token expired or invalid
    return next
      .handle(authReq)
      .pipe(catchError((e: HttpErrorResponse) => this.refreshToken(authReq, e, next)));
  }

  refreshToken(req: HttpRequest<unknown>, e: HttpErrorResponse, next: HttpHandler) {
    // ignoring 401 error code if context have http-token
    // for example: used in user-api.serice [patch /user/password]: api returns 401 if user typed wrong password
    const shouldSkipIntercept = req.context.get(IGNORE_ERROR_INTERCEPTOR);
    if (shouldSkipIntercept) return next.handle(req);

    // if /auth/refresh returns 401 interceptor throwing sessionExpired
    if (e.status === 401 && !req.url.endsWith('/auth/refresh'))
      return this.api.refresh().pipe(
        switchMap((res: HttpResponse<unknown>) => {
          const newToken = res.headers.get('Authorization')?.split(' ')[1] || null;
          if (newToken) this.setAccessToken(newToken);
          // after refreshing access token, interceptor cloning initial request
          const retryReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${this.accessToken}`),
          });

          return next.handle(retryReq);
        }),
        catchError((err) => this.error.throwSessionExpired(err)),
      );
    this.error.setErrorByCode(e.status);
    return throwError(() => e);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }
}
