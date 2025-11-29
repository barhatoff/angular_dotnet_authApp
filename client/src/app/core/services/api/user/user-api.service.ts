import { Injectable } from '@angular/core';
import {
  UpdateAvatarRequest,
  UpdateNicknameRequest,
  UpdatePasswordRequest,
  UpdateUserRoleRequest,
} from './user-request.interface';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponseMessage, TableResponse } from '@shared/models/api-responses.model';
import { UserDto } from '@shared/models/user.model';
import { ignoringErrorInterceptorContext } from '@core/http/http-context';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  updateAvatar(req: UpdateAvatarRequest): Observable<ApiResponseMessage> {
    return this.http.patch<ApiResponseMessage>(`${this.apiUrl}/user/profile`, req);
  }
  updateNickname(req: UpdateNicknameRequest): Observable<ApiResponseMessage> {
    return this.http.patch<ApiResponseMessage>(`${this.apiUrl}/user/profile`, req);
  }
  updatePassword(req: UpdatePasswordRequest): Observable<ApiResponseMessage> {
    return this.http.patch<ApiResponseMessage>(`${this.apiUrl}/user/password`, req, {
      context: ignoringErrorInterceptorContext(),
    });
  }
  // ADMIN
  updateRole(req: UpdateUserRoleRequest): Observable<ApiResponseMessage> {
    return this.http.patch<ApiResponseMessage>(`${this.apiUrl}/user/role`, req);
  }
  getUsers(queryParams?: string): Observable<TableResponse<UserDto>> {
    return this.http.get<TableResponse<UserDto>>(
      `${this.apiUrl}/user${queryParams ? `?${queryParams}` : ''}`,
    );
  }
  deleteUser(email: string): Observable<ApiResponseMessage> {
    return this.http.delete<ApiResponseMessage>(`${this.apiUrl}/user?email=${email}`);
  }
}
