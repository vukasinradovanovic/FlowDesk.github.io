import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Auth } from './layout/auth/auth';
import { Dashboard } from './layout/dashboard/dashboard';
import { Index } from './dashboard/index/index';

export const routes: Routes = [
	{
		path: '',
		component: Auth,
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
		children: [
			{
				path: '',
				component: Index,
			},
		],
	},
];
