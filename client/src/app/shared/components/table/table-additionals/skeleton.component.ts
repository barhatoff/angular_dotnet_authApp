import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'ui-table-skeleton',
  imports: [MatTableModule],
  templateUrl: './skeleton.component.html',
})
export class TableSkeletonComponent {
  limit = input<number>(10);
  columnsCopacity = 5;

  displayedColumns: string[] = Array.from({ length: this.columnsCopacity }, (_, i) =>
    i === 0 ? `num` : `skeleton-${i}`,
  );

  componentsCopacity = Array.from({ length: this.limit() }, (_, i) => {
    return { num: i + 10 };
  });
}
