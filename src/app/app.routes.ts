import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Auth } from './layout/auth/auth';
import { Dashboard } from './layout/dashboard/dashboard';
import { Index } from './dashboard/index/index';
import { Index as ProjectsIndex } from './dashboard/project/index/index';
import { Index as TeamsIndex } from './dashboard/team/index/index';
import { authGuard } from './guards/auth-guard';
import { anonGuard } from './guards/anon-guard';
import { EditProject } from './dashboard/project/edit/edit';
import { Profile } from './dashboard/user/profile/profile';
import { CreateProject } from './dashboard/project/create/create';

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
		data: { breadcrumb: 'Workspace' },
		children: [
			{
				path: '',
				component: Index,
				data: { breadcrumb: 'Dashboard' },
			},
			{
				path: 'projects',
				component: ProjectsIndex,
				data: { breadcrumb: 'Projects' },
			},
			{
				path: 'projects/create',
				component: CreateProject,
				data: { breadcrumb: 'New Project' },
			},
			{
				path: 'projects/edit/:slug',
				component: EditProject,
				data: { breadcrumb: 'Edit Project' },
			},
			{
				path: 'team',
				component: TeamsIndex,
				data: { breadcrumb: 'Team' },
			},
			{
				path: 'profile',
				component: Profile,
				data: { breadcrumb: 'Profile' },
			},
		],
	},
	// Safe fallback wildcard: redirects any random mistyped URL to login
	{
		path: '**',
		redirectTo: '',
	},
];
