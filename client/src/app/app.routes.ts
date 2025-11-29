import { Routes } from '@angular/router';
import {
  AuditComponent,
  ErrorComponent,
  HomeComponent,
  LoginComponent,
  RegisterComponent,
  UsersComponent,
} from '@features/index';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'error', component: ErrorComponent },

  { path: 'administration/audit', component: AuditComponent },
  { path: 'administration/users', component: UsersComponent },

  { path: '**', redirectTo: '/error?code=404' },
];
