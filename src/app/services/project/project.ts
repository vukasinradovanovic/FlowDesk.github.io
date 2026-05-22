import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Project {
	id: number;
	name: string;
	tasksCount: number;
	icon: string;
	theme: string;
	progress: number;
	dueDate: Date;
	status: string;
	statusTheme: string;
	members: number[];
}

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private readonly auth = inject(AuthService);
	private readonly http = inject(HttpClient);
	private projects: Project[] | null = null;

	private loadProjects(): Observable<Project[]> {
		if (this.projects !== null) {
			return of(this.projects);
		}

		return this.http.get<{ projects: Project[] }>('/assets/data/data.json').pipe(
			map((response) => response.projects),
			tap((projects) => (this.projects = projects)),
		);
	}

	public getProjects(): Observable<Project[]> {
		return this.loadProjects().pipe(
			map(projects => projects.filter(p => p.members.includes(this.auth.currentUser?.id ?? -1)))
		);
	}
}
