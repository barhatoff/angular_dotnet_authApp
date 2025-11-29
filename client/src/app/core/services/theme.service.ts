import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;

  constructor(renderer: RendererFactory2) {
    this.renderer = renderer.createRenderer(null, null);
    this.checkBrowserTheme();
    this.listenForThemeChanges();
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
