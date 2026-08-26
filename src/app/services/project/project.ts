import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, Observable, of, tap } from 'rxjs';
import { TeamService } from '../team/team.service';
import { Status } from '../status/status';

export interface Project {
	id: number;
	name: string;
	slug: string;
	icon: string;
	theme: string;
	dueDate: Date;
	status: Status;
	//   teamId?: number | string;
	//   members?: (number | string)[];
	//   updatedAt?: string;
}

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private readonly auth = inject(AuthService);
	private readonly teamService = inject(TeamService);
	private readonly http = inject(HttpClient);

	private readonly getProjectsApiUrl = 'https://localhost:7175/api/getalluserprojects';

	public readonly allProjects = signal<Project[] | null>(null);

	private loadProjects(): Observable<Project[]> {
		const cachedProjects = this.allProjects();

		if (cachedProjects !== null) {
			return of(cachedProjects);
		}

		return this.http
			.get<Project[]>(this.getProjectsApiUrl)
			.pipe(tap((projects) => this.allProjects.set(projects)));
	}

	public getProjects(): Observable<Project[]> {
		return this.loadProjects();
	}

	public getProjectBySlug(slug: string): Observable<Project | undefined> {
		return this.loadProjects().pipe(map((projects) => projects.find((p) => p.slug === slug)));
	}
}
