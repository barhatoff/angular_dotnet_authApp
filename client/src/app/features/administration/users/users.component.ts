import { Component, signal } from '@angular/core';
import { isUserDto } from '@core/utils/type-guard.util';
import { __param } from 'tslib';
import { DialogService } from '@core/services/dialog.service';
import { EditUserComponent, EditUserDialogData } from './dialogs/edit-user.component';
import { SnackbarService } from '@core/services/snackbar.service';
import { formatTableParamsToQueryParams } from '@core/utils/table.util';
import { TableComponent, TableParams } from '@shared/components/table/table.component';
import { TableResponse, UserDto, UserDtoTable } from '@shared/models';
import { AuthService } from '@core/services/auth.service';
import { AdminUserApiService } from './api/admin-user-api.service';

@Component({
  selector: 'app-users.component',
  imports: [TableComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  // table data
  users = signal<TableResponse<UserDto>>({ data: [], total: 0, page: 1, pages: 0 });

  // table params
  displayedColumns: string[] = ['#', 'email', 'nickname', 'role'];
  tableParams = signal<TableParams>({
    searchParam: undefined,
    columnsWhichCanBeSorted: ['email', 'nickname', 'role'],
    sortBy: 'email',
    sortDirection: 'asc',
    pagination: { limit: 30, page: 1 },
    rowActions: ['edit'],
  });

  ngOnInit() {
    this.fetchUsers(this.tableParams());
  }

  constructor(
    private api: AdminUserApiService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private authService: AuthService,
  ) {}

  private isUserСhangesHimself(target: UserDtoTable): boolean {
    const user = this.authService.user();
    if (user?.email === target.email) {
      this.snackbar.open('You cant modified yourself', 'error');
      return false;
    }
    return true;
  }

  fetchUsers(param: TableParams) {
    this.api.getUsers(formatTableParamsToQueryParams(param)).subscribe({
      next: (res) => {
        this.users.set(res);
      },
    });
  }

  handleParamsChanged(newParams: TableParams) {
    this.tableParams.set(newParams);
    this.fetchUsers(newParams);
  }
  editUser = (target: unknown) => {
    if (isUserDto(target))
      if (this.isUserСhangesHimself(target)) {
        const dialogData: EditUserDialogData = {
          user: target,
          refetch: () => this.fetchUsers(this.tableParams()),
        };
        this.dialog.open(EditUserComponent, dialogData);
      }
  };
}
