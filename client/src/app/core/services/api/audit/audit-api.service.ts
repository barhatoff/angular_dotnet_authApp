import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Audit } from './audit-response.interface';
import { TableResponse } from '@shared/models/api-responses.model';

@Injectable({
  providedIn: 'root',
})
export class AuditApiService {
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getLogs(queryParams?: string): Observable<TableResponse<Audit>> {
    return this.http.get<TableResponse<Audit>>(
      `${this.apiUrl}/audit${queryParams ? `?${queryParams}` : ''}`,
    );
  }
}
