import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'table-ui-sorting-arrow',
  imports: [CommonModule, MatIconModule],
  templateUrl: './sorting-arrow.component.html',
})
export class SortingArrowComponent {
  isActive = input.required<boolean>();
  isHovered = input.required<boolean>();
  direction = input.required<'asc' | 'desc'>();
}
