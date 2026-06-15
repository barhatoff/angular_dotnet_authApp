import { Component, signal } from '@angular/core';
import { formatTableParamsToQueryParams } from '@core/utils/table.util';
import { TableComponent, TableParams } from '@shared/components/table/table.component';
import { TableResponse } from '@shared/models';
import { AuditApiService } from './api/audit-api.service';
import { Audit } from './api/audit-response.interface';

@Component({
  selector: 'app-audit.component',
  imports: [TableComponent],
  templateUrl: './audit.component.html',
})
export class AuditComponent {
  // data
  audits = signal<TableResponse<Audit>>({ data: [], total: 0, page: 1, pages: 0 });

  // table params
  displayedColumns: string[] = ['#', 'time', 'user', 'role', 'method', 'url', 'statusCode', 'ip'];
  tableParams = signal<TableParams>({
    searchParam: undefined,
    columnsWhichCanBeSorted: ['time'],
    sortBy: 'time',
    sortDirection: 'asc',
    pagination: { limit: 50, page: 1 },
  });

  ngOnInit() {
    this.fetchAudits(this.tableParams());
  }
  constructor(private api: AuditApiService) {}

  fetchAudits(param: TableParams) {
    this.api.getLogs(formatTableParamsToQueryParams(param)).subscribe({
      next: (res) => {
        this.audits.set(res);
      },
    });
  }

  handleParamsChanged(newParams: TableParams) {
    this.tableParams.set(newParams);
    this.fetchAudits(newParams);
  }
}
