import { inject, Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private breakpointObserver = inject(BreakpointObserver);

  readonly isCompactLayout = signal(false);

  constructor(renderer: RendererFactory2) {
    this.renderer = renderer.createRenderer(null, null);
    this.checkBrowserTheme();
    this.listenForThemeChanges();

    this.breakpointObserver
      .observe([
        '(max-width: 959.98px)',
        '(max-width: 1366px) and (max-height: 768px)',
        '(max-width: 1600px) and (max-height: 950px)',
      ])
      .pipe(
        takeUntilDestroyed(),
        map((result) => result.matches),
      )
      .subscribe((matches) => this.isCompactLayout.set(matches));
  }

  private setLightTheme(): void {
    this.renderer.removeClass(document.body, 'dark');
    this.renderer.addClass(document.body, 'light');
  }
  private setDarkTheme(): void {
    this.renderer.removeClass(document.body, 'light');
    this.renderer.addClass(document.body, 'dark');
  }
  private checkBrowserTheme(): void {
    if (typeof window !== 'undefined')
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        this.setDarkTheme();
      else this.setLightTheme();
  }
  private listenForThemeChanges(): void {
    if (typeof window !== 'undefined')
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) this.setDarkTheme();
        else this.setLightTheme();
      });
  }

  public toggleTheme(): void {
    if (document.body.classList.contains('dark')) this.setLightTheme();
    else this.setDarkTheme();
  }
  public isDarkMode(): boolean {
    return document.body.classList.contains('dark');
  }
}
