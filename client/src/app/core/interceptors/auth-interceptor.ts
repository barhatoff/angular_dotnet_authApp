import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGNORE_ERROR_INTERCEPTOR } from '@core/http/http-tokens';
import { ErrorService } from '@core/services/_barrel';
import { AuthApiService } from '@core/services/api';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private accessToken: string | null = localStorage.getItem('accessToken') ?? null;

  constructor(
    private api: AuthApiService,
    private error: ErrorService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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

  refreshToken(req: HttpRequest<any>, e: HttpErrorResponse, next: HttpHandler) {
    // ignoring 401 error code if context have http-token
    // for example: used in user-api.serice [patch /user/password]: api returns 401 if user typed wrong password
    const shouldSkipIntercept = req.context.get(IGNORE_ERROR_INTERCEPTOR);
    if (shouldSkipIntercept) return next.handle(req);

    // if /auth/refresh returns 401 interceptor throwing sessionExpired
    if (e.status === 401 && !req.url.endsWith('/auth/refresh'))
      return this.api.refresh().pipe(
        switchMap((res: HttpResponse<any>) => {
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
