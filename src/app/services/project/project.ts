import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, Observable, of, tap } from 'rxjs';
import { Status } from '../status/status';
import { ProjectFormData } from '../../dashboard/forms/project-form.component/project-form.component';

export interface Project {
	id: number;
	name: string;
	slug: string;
	icon: string;
	theme: string;
	dueDate: Date;
	//   teamId?: number | string;
	//   members?: (number | string)[];
	//   updatedAt?: string;
}

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private readonly auth = inject(AuthService);
	private readonly http = inject(HttpClient);

	private readonly getProjectsApiUrl = 'https://localhost:7175/api/getalluserprojects';
	private readonly createProjectApiUrl = 'https://localhost:7175/api/createproject';
	private readonly getAllProjectsApiUrl = 'https://localhost:7175/api/getallprojects';

	public readonly allUsersProjects = signal<Project[] | null>(null);
	public readonly AllProjects = signal<Project[] | null>(null);

	private loadProjects(signal: typeof this.allUsersProjects | typeof this.AllProjects, apiUrl: string): Observable<Project[]> {
		const cachedProjects = signal();

		if (cachedProjects !== null) {
			return of(cachedProjects);
		}

		return this.http
			.get<Project[]>(apiUrl)
			.pipe(tap((projects) => signal.set(projects)));
	}

	public getUsersProjects(): Observable<Project[]> {
		return this.loadProjects(this.allUsersProjects, this.getProjectsApiUrl);
	}

	public getAllProjects(): Observable<Project[]> {
		return this.loadProjects(this.AllProjects, this.getAllProjectsApiUrl);
	}

	public getProjectBySlug(slug: string): Observable<Project | undefined> {
		return this.loadProjects(this.allUsersProjects, this.getProjectsApiUrl).pipe(map((projects) => projects.find((p) => p.slug === slug)));
	}

	public createProject(payload: ProjectFormData): Observable<any> {
		return this.http.post<any>(this.createProjectApiUrl, payload);
	}
}
