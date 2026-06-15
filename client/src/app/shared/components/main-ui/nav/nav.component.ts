import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AuthService, SnackbarService } from '@core/services/_barrel';

interface NavElement {
  groupName: string;
  routes: { route: string; url: string; adminOnly?: boolean }[];
  adminOnly?: boolean;
}

@Component({
  selector: 'app-ui-nav',
  imports: [MatSidenavModule, MatIconModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  readonly drawer = input.required<MatDrawer>();
  readonly isCompactLayout = input.required<boolean>();
  public readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);

  public readonly navElements: NavElement[] = [
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

  constructor() {
    effect(() => {
      if (!this.isCompactLayout()) {
        this.drawer().open();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.drawer().close();
  }
}
