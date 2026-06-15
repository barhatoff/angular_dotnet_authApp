import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService, ThemeService, RouterService, AuthService } from '@core/services/_barrel';
import { MainLayer } from '@shared/layers/main-layer/main-layer';
import { ErrorComponent } from '@features/index';
import { AuthLayer } from '@shared/layers/auth-layer/auth-layer';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ErrorComponent, MainLayer, AuthLayer],
  templateUrl: './app.html',
})
export class App {
  constructor(
    public routerService: RouterService,
    private authService: AuthService,
    public errorService: ErrorService,
    public themeService: ThemeService,
  ) {
    this.authService.loadUser();
  }
}
