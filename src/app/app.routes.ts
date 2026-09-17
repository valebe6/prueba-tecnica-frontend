import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Board } from './board/board';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './users/users';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: 'board',
    component: Board,
    canActivate: [authGuard],
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },

  {
    path: 'users',
    component: Users,
    canActivate: [authGuard, adminGuard],
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
