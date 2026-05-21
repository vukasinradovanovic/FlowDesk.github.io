import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Auth } from './layout/auth/auth';
import { Dashboard } from './layout/dashboard/dashboard';
import { Index } from './dashboard/index/index';
import { authGuard } from './auth/guards/auth-guard';
import { anonGuard } from './auth/guards/anon-guard';

export const routes: Routes = [
	{
		path: '',
		component: Auth,
		canActivate: [anonGuard],
		children: [
			{
				path: '',
				component: Login,
				data: { animation: 'login' },
			},
			{
				path: 'register',
				component: Register,
				data: { animation: 'register' },
			},
		],
	},
	{
		path: 'dashboard',
		component: Dashboard,
		canActivate: [authGuard],
		children: [
			{
				path: '',
				component: Index,
			},
		],
	},
	// Safe fallback wildcard: redirects any random mistyped URL to login
    { 
        path: '**', 
        redirectTo: '' 
    }
];
