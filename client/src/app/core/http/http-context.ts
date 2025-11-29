import { HttpContext } from '@angular/common/http';
import { IGNORE_ERROR_INTERCEPTOR } from './http-tokens';

export function ignoringErrorInterceptorContext(): HttpContext {
  // IGNORING ERRORS TO PROCESS IN FORM
  let context = new HttpContext();
  context = context.set(IGNORE_ERROR_INTERCEPTOR, true);

  return context;
}
