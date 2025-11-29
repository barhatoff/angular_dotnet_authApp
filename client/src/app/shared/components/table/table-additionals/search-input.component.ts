import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { TableParams } from '../table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-search-input',
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  params = input.required<TableParams>();
  paramsChanged = output<TableParams>();

  public searchText: string = '';

  // DEBOUNCE search input changes
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | undefined;

  isSearchparamFocused = signal<boolean>(false);

  ngOnInit() {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((newSearchParam) => {
        this.executeSearch(newSearchParam);
      });
  }
  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchChange(newSearchParam: string) {
    if (newSearchParam.length > 0) this.isSearchparamFocused.set(true);
    else this.isSearchparamFocused.set(false);

    if (newSearchParam === this.params().searchParam) return;

    this.searchSubject.next(newSearchParam);
  }

  private executeSearch(newSearchParam: string): void {
    if (newSearchParam === this.params().searchParam) return;

    let updatedParams: TableParams = {
      ...this.params(),
      searchParam: newSearchParam.length > 0 ? newSearchParam : undefined,
    };
    this.paramsChanged.emit(updatedParams);
  }
}
