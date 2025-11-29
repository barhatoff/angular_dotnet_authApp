import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { SnackbarService, UserService } from '@core/services/_barrel';
import { AuthApiService } from '@core/services/api';

interface NavElement {
  groupName: string;
  routes: { route: string; url: string; adminOnly?: boolean }[];
  adminOnly?: boolean;
}

@Component({
  selector: 'app-nav',
  imports: [MatSidenavModule, MatIconModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  public readonly NavElements: NavElement[] = [
    {
      groupName: 'Administration',
      routes: [
        { route: 'Users', url: 'administration/users', adminOnly: true },
        { route: 'Audit', url: 'administration/audit', adminOnly: true },
      ],
      adminOnly: true,
    },
    { groupName: 'Global', routes: [{ route: 'Home', url: '/' }] },
  ];

  @Input() drawer!: MatDrawer;

  constructor(
    public userService: UserService,
    private authApi: AuthApiService,
    private snackbar: SnackbarService,
    private router: Router,
  ) {}

  logout() {
    this.drawer.close();
    this.authApi.logout().subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        this.snackbar.open('Logout successful', 'success');
        this.userService.logout();
        this.router.navigate(['/login']);
      },
      error: (e) => {
        this.snackbar.open('Logout error. Try again', 'error');
      },
    });
  }
}
