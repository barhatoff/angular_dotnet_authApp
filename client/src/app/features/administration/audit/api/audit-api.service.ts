import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Audit } from './audit-response.interface';
import { TableResponse } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuditApiService {
  private readonly apiUrl = environment.apiUrl + '/admin/audits';
  constructor(private http: HttpClient) {}

  getLogs(queryParams?: string): Observable<TableResponse<Audit>> {
    return this.http.get<TableResponse<Audit>>(
      `${this.apiUrl}${queryParams ? `?${queryParams}` : ''}`,
    );
  }
}
