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
import { CreateTeam } from './dashboard/team/create-team/create-team';
import { EditTeam } from './dashboard/team/edit-team/edit-team';
import { ViewAllTeams } from './dashboard/team/view-all-teams/view-all-teams';
import { ViewAllProjects } from './dashboard/project/view-all-projects/view-all-projects';
import { ViewAllTasks } from './dashboard/tasks/view-all-tasks/view-all-tasks';
import { Index as TasksIndex } from './dashboard/tasks/index/index';
import { Show as ShowTask } from './dashboard/tasks/show/show/show';
import { ActivationSuccess } from './auth/activation-success/activation-success';
import { activationGuard } from './guards/activation-guard';

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
			{
				path: 'activate',
				component: ActivationSuccess,
				canActivate: [activationGuard],
				data: { animation: 'activate' },
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
				path: 'projects/all',
				component: ViewAllProjects,
				data: { breadcrumb: 'All Projects' },
			},
			{
				path: 'tasks/all',
				component: ViewAllTasks,
				data: { breadcrumb: 'All Tasks' },
			},
			{
				path: 'tasks/:slug',
				component: ShowTask,
				data: {
					breadcrumb: 'Task',
					breadcrumbParents: [
						{ match: '/dashboard/tasks/all', label: 'All Tasks', url: '/dashboard/tasks/all' },
						{ match: '/dashboard/tasks', label: 'Tasks', url: '/dashboard/tasks' },
					],
				},
			},
			{
				path: 'tasks',
				component: TasksIndex,
				data: { breadcrumb: 'Tasks' },
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
				path: 'teams/all',
				component: ViewAllTeams,
				data: { breadcrumb: 'All Teams' },
			},
			{
				path: 'team/create',
				component: CreateTeam,
				data: { breadcrumb: 'New Team' },
			},
			{
				path: 'team/edit/:id',
				component: EditTeam,
				data: { breadcrumb: 'Edit Team' },
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
