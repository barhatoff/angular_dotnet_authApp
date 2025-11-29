import { Component, effect, input, output, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TableResponse } from '@shared/models/api-responses.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  EmptyTableComponent,
  SearchInputComponent,
  SortingArrowComponent,
  TableSkeletonComponent,
} from './additionals.barrel';
import { DeleteButtonComponent, EditButtonComponent } from '../buttons';

export interface TableParams {
  searchParam: string | undefined;
  columnsWhichCanBeSorted: string[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pagination: {
    limit: number;
    page: number;
  };
  rowActions?: string[];
}

@Component({
  selector: 'ui-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    TableSkeletonComponent,
    SortingArrowComponent,
    SearchInputComponent,
    EmptyTableComponent,
    DeleteButtonComponent,
    EditButtonComponent,
  ],
  templateUrl: './table.component.html',
})
export class TableComponent {
  data = input.required<TableResponse<any>>();
  displayedColumns = input.required<string[]>();

  deleteAction = input<(target: unknown) => void>();
  editAction = input<(target: unknown) => void>();

  params = input.required<TableParams>();
  paramsChanged = output<TableParams>();

  hoveredHeader = signal<string | null>(null);
  isPageLoaded = signal<boolean>(false);

  ngOnInit() {
    if (this.params().rowActions) this.displayedColumns().push('actions');
  }
  constructor() {
    effect(() => {
      if (this.data().data.length > 0) this.isPageLoaded.set(true);
    });
  }

  onSortChange(newSortBy: string) {
    if (!this.params().columnsWhichCanBeSorted.includes(newSortBy)) return;

    const isNewColumn = this.params().sortBy !== newSortBy;
    let updatedParams: TableParams = {
      ...this.params(),
    };
    if (isNewColumn) {
      updatedParams.sortBy = newSortBy;
      updatedParams.sortDirection = 'asc';
    } else {
      updatedParams.sortDirection = this.params().sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.paramsChanged.emit(updatedParams);
  }

  onPageChange(event: PageEvent) {
    const limit = event.pageSize;
    const newPage = event.pageIndex + 1;

    let updatedParams: TableParams = {
      ...this.params(),
      pagination: {
        limit: limit,
        page: newPage,
      },
    };
    this.paramsChanged.emit(updatedParams);
  }

  handleParamsChange(updatedParams: TableParams) {
    this.paramsChanged.emit(updatedParams);
  }
}
