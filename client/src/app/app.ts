import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ErrorService, ThemeService, UserService, RouterService } from '@core/services/_barrel';
import { MainLayer } from '@shared/layers/main-layer/main-layer';
import { ErrorComponent } from '@features/index';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ErrorComponent, MatButtonModule, MainLayer],
  templateUrl: './app.html',
})
export class App {
  constructor(
    public routerService: RouterService,
    private userService: UserService,
    public errorService: ErrorService,
    public themeService: ThemeService,
  ) {
    this.userService.loadUser();
  }
}
