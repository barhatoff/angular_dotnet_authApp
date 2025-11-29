import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { UserService } from '@core/services/_barrel';
import { HeaderComponent, ContentComponent, NavComponent } from '@shared/components/main-ui';

@Component({
  selector: 'app-main-layer',
  imports: [
    HeaderComponent,
    ContentComponent,
    NavComponent,
    MatSidenavModule,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './main-layer.html',
})
export class MainLayer {
  constructor(public userService: UserService) {}
}
