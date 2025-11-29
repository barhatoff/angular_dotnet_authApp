import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private readonly authUrls = ['login', 'register'];

  isAuthRoute = signal(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isAuthRoute.set(this.authUrls.some((url) => e.urlAfterRedirects.includes(url)));
      });
  }
}
