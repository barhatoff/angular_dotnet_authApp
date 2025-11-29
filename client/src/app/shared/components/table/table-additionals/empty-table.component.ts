import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'ui-empty-table',
  imports: [CommonModule, MatTableModule],
  templateUrl: './empty-table.component.html',
})
export class EmptyTableComponent {
  displayedColumns = input.required<string[]>();
  dataSource = [{}];
}
