import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { HeaderComponent, ContentComponent, NavComponent } from '@shared/components/main-ui';

@Component({
  selector: 'app-main-layer',
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    ContentComponent,
    NavComponent,
  ],
  templateUrl: './main-layer.html',
})
export class MainLayer {
  private readonly themeService = inject(ThemeService);
  readonly isCompactLayout = computed(() => this.themeService.isCompactLayout());
}
