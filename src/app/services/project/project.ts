import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, Observable, of, tap } from 'rxjs';
import { TeamService } from '../team/team.service';

export interface Project {
	id: number;
	name: string;
	slug: string;
	tasksCount: number;
	icon: string;
	theme: string;
	progress: number;
	dueDate: Date;
	status: string;
	statusTheme: string;
	teamId: number;
	members?: number[]; // Added locally for filtering
}

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private readonly auth = inject(AuthService);
	private readonly teamService = inject(TeamService);
	private readonly http = inject(HttpClient);

	public readonly allProjects = signal<Project[] | null>(null);

	private loadProjects(): Observable<Project[]> {
		const cachedProjects = this.allProjects();

		if (cachedProjects !== null) {
			return of(cachedProjects);
		}

		return this.http
			.get<{ projects: Project[]; 'team-projects': any[] }>('/assets/data/data.json')
			.pipe(
				map((response) => {
					const tProjects = response['team-projects'] || [];
					return response.projects.map((p) => ({
						...p,
						members: tProjects.filter((tp) => tp.projectId === p.id).map((tp) => tp.userId),
					}));
				}),
				tap((projects) => this.allProjects.set(projects)),
			);
	}

	public getProjects(): Observable<Project[]> {
		return this.loadProjects().pipe(
			map((projects) => {
				const currentUserId = this.auth.currentUser()?.id ?? -1;
				const currentTeam = this.teamService
					.allTeams()
					?.find((team) => team.members?.includes(currentUserId));
				const currentTeamId = currentTeam?.id ?? -1;

				return projects.filter((p) => p.teamId === currentTeamId);
			}),
		);
	}

	public getProjectBySlug(slug: string): Observable<Project | undefined> {
		return this.loadProjects().pipe(map((projects) => projects.find((p) => p.slug === slug)));
	}
}
