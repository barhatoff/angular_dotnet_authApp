import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponseMessage, TableResponse, UserDto } from '@shared/models';
import { Observable } from 'rxjs';
import { UpdateUserRoleRequest } from './admin-user-request.interface';

@Injectable({ providedIn: 'root' })
export class AdminUserApiService {
  private readonly apiUrl = environment.apiUrl + '/admin/users';
  private readonly http = inject(HttpClient);

  updateRole(id: string, req: UpdateUserRoleRequest): Observable<ApiResponseMessage> {
    return this.http.patch<ApiResponseMessage>(`${this.apiUrl}/${id}/role`, req);
  }
  getUsers(queryParams?: string): Observable<TableResponse<UserDto>> {
    return this.http.get<TableResponse<UserDto>>(
      `${this.apiUrl}${queryParams ? `?${queryParams}` : ''}`,
    );
  }
  deleteUser(id: string): Observable<ApiResponseMessage> {
    return this.http.delete<ApiResponseMessage>(`${this.apiUrl}/${id}`);
  }
}
