import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  UpdateAvatarRequest,
  UpdateNicknameRequest,
  UpdatePasswordRequest,
} from './user-update-request.interface';
import { ignoringErrorInterceptorContext } from '@core/http/http-context';
import { ApiResponseMessage } from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserUpdateApiService {
  private readonly apiUrl = environment.apiUrl + '/users';
  private readonly http = inject(HttpClient);

  updateAvatar(req: UpdateAvatarRequest): Observable<ApiResponseMessage> {
    return this.http.patch<ApiResponseMessage>(`${this.apiUrl}/profile`, req);
  }
  updateNickname(req: UpdateNicknameRequest): Observable<ApiResponseMessage> {
    return this.http.patch<ApiResponseMessage>(`${this.apiUrl}/profile`, req);
  }
  updatePassword(req: UpdatePasswordRequest): Observable<ApiResponseMessage> {
    return this.http.patch<ApiResponseMessage>(`${this.apiUrl}/password`, req, {
      context: ignoringErrorInterceptorContext(),
    });
  }
}
