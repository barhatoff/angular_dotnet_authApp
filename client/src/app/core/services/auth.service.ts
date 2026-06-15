import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { environment } from '@env/environment';
import { ErrorService, SnackbarService } from './_barrel';
import { AuthApiService } from './api';
import { UserDto, UserRole } from '@shared/models';
import { LoginRequest } from './api/auth/auth-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly snackbar = inject(SnackbarService);

  private readonly _user = signal<UserDto | null>(null);
  private readonly _userLoaded = signal(false);

  public readonly user = this._user.asReadonly();
  public readonly userLoaded = this._userLoaded.asReadonly();

  public readonly userRole: Signal<UserRole | null> = computed(() => this._user()?.role ?? null);
  public readonly isLoggedIn = computed(() => !!this._user());

  private readonly api = inject(AuthApiService);
  private readonly error = inject(ErrorService);

  login(req: LoginRequest) {
    return this.api.login(req).pipe(
      tap((res) => {
        const authHeader = res.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          localStorage.setItem('accessToken', token);
        }
      }),
    );
  }
  logout() {
    this.api
      .logout()
      .pipe(
        finalize(() => {
          localStorage.removeItem('accessToken');
          this.clearUser();

          this.snackbar.open('Exit from app...', 'warning');

          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
        }),
      )
      .subscribe();
    return;
  }
  isAlreadyLoggedIn() {
    if (this.user()) {
      this.error.setError(
        {
          code: 400,
          instructions: 'To home',
          linkTo: '/',
          message: 'Already logged!',
        },
        true,
      );
    }
  }
  loadUser() {
    this.api.whoami().subscribe({
      error: () => {
        this._userLoaded.set(true);
        this._user.set(null);
      },
      next: (user: UserDto) => {
        this._userLoaded.set(true);
        this._user.set(user || null);
      },
    });
  }
  clearUser() {
    this._user.set(null);
  }
}
