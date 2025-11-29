import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGNORE_ERROR_INTERCEPTOR } from '@core/http/http-tokens';
import { ErrorService } from '@core/services/_barrel';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // ignoring all errors and didnt throw into errorService for process in ui area
    const shouldSkipIntercept = req.context.get(IGNORE_ERROR_INTERCEPTOR);
    if (shouldSkipIntercept) return next.handle(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorStatus = error.status === 0 ? 500 : error.status;
        const { message, instructions, linkTo } = this.errorService.getAppErrorByCode(errorStatus);

        // if api response message is undefined message setted by errorService binding
        let resMessage =
          (error.error?.message as string) || JSON.stringify(error.error.errors) || message;

        this.errorService.setError({
          code: errorStatus,
          message: resMessage,
          instructions,
          linkTo,
        });
        return throwError(() => error);
      }),
    );
  }
}
