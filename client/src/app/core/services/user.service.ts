import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { AuthApiService } from './api/auth/auth-api.service';
import { UserDto, UserRole } from '@shared/models/user.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _user = signal<UserDto | null>(null);
  private readonly _userLoaded = signal(false);

  public readonly user = this._user.asReadonly();
  public readonly userLoaded = this._userLoaded.asReadonly();

  public readonly userRole: Signal<string | null> = computed(() => this._user()?.role ?? null);
  public readonly isLoggedIn = computed(() => !!this._user());

  constructor(
    private api: AuthApiService,
    private error: ErrorService,
  ) {}

  loadUser() {
    this.api.whoim().subscribe({
      next: (user: UserDto) => {
        this._userLoaded.set(true);
        this._user.set(user || null);
      },
      error: () => {
        this._userLoaded.set(true);
        this._user.set(null);
      },
    });
  }

  logout() {
    localStorage.removeItem('accessToken');
    this._user.set(null);
  }

  isAlreadyLoggedIn() {
    if (this.user()) {
      this.error.setError({
        message: 'Already logged in',
        code: 400,
        instructions: 'Go to home and logout',
        linkTo: '/',
      });
    }
  }
}
