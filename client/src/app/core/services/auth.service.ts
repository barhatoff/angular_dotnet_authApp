import { Injectable } from '@angular/core';
import { AuthApiService } from './api';
import { Router } from '@angular/router';
import { LoginRequest } from './api/auth/auth-request.interface';
import { tap } from 'rxjs';
import { SnackbarService, UserService } from './_barrel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private api: AuthApiService,
    private snackbar: SnackbarService,
    private router: Router,
    private userService: UserService,
  ) {}

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

  revokeAllSessions() {
    this.api.revokeAllSessions().subscribe({
      next: () => {
        this.snackbar.open('All sessions revoked. Redirecting to login...', 'success');
        this.userService.logout();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.snackbar.open('Sessions didnt revoked. Try again', 'error');
      },
    });
  }
}
