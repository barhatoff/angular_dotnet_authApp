import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { LoginRequest, RegisterRequest } from './auth-request.interface';
import { Observable } from 'rxjs';
import { ApiResponseMessage } from '@shared/models/api-responses.model';
import { UserDto } from '@shared/models/user.model';
import { ignoringErrorInterceptorContext } from '../../../http/http-context';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(req: LoginRequest): Observable<HttpResponse<ApiResponseMessage>> {
    return this.http.post<ApiResponseMessage>(`${this.apiUrl}/auth/login`, req, {
      withCredentials: true,
      observe: 'response',
    });
  }
  register(req: RegisterRequest): Observable<ApiResponseMessage> {
    return this.http.post<ApiResponseMessage>(`${this.apiUrl}/auth/register`, req, {
      context: ignoringErrorInterceptorContext(),
    });
  }
  refresh(): Observable<HttpResponse<ApiResponseMessage>> {
    return this.http.post<ApiResponseMessage>(
      `${this.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true, observe: 'response' },
    );
  }
  whoim(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/auth/whoim`);
  }
  logout(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/auth/logout`, {
      withCredentials: true,
    });
  }
  revokeAllSessions(): Observable<ApiResponseMessage> {
    return this.http.delete<ApiResponseMessage>(`${this.apiUrl}/auth/revoke-sessions`);
  }
}
