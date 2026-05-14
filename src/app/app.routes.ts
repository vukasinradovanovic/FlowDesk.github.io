import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Auth } from './layout/auth/auth';

export const routes: Routes = [
	{
		path: '',
		component: Auth,
		children: [
			{
				path: '',
				component: Login,
			},
			{
				path: 'register',
				component: Register,
			},
		],
	},
];
