import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, MatSidenavModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() drawer!: MatDrawer;
}
