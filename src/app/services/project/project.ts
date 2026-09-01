import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, of, tap } from 'rxjs';
import { Status } from '../status/status';
import { ProjectFormData } from '../../dashboard/forms/project-form.component/project-form.component';
import { PaginatedResponse, Pagination, PaginationParams } from '../pagination/pagination';
import { TeamName } from '../team/team.service';

export interface Project {
	id: number;
	name: string;
	slug: string;
	icon: string;
	theme: string;
	dueDate: Date;
	status: Status;
	teams: TeamName[];
}

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private readonly auth = inject(AuthService);
	private readonly http = inject(HttpClient);
	private readonly pagination = inject(Pagination);

	private readonly getProjectsApiUrl = 'https://localhost:7175/api/getalluserprojects';
	private readonly createProjectApiUrl = 'https://localhost:7175/api/createproject';
	private readonly getAllProjectsApiUrl = 'https://localhost:7175/api/getallprojects';
	private readonly getProjectByIdApiUrl = 'https://localhost:7175/api/showproject';
	private readonly updateProjectApiUrl = 'https://localhost:7175/api/updateproject';
	private readonly deleteProjectApiUrl = 'https://localhost:7175/api/deleteproject';

	public readonly userProjectsState = signal<PaginatedResponse<Project> | null>(null);
	public readonly allProjectsState = signal<PaginatedResponse<Project> | null>(null);

	public readonly allUsersProjects = computed(() => {
		const state = this.userProjectsState() as any;
		return state?.items ?? state?.Items ?? [];
	});

	public readonly totalUserProjectsCount = computed(() => {
		const state = this.userProjectsState() as any;
		if (!state) return 0;

		return state.totalCount ?? state.TotalCount ?? state.items?.length ?? state.Items?.length ?? 0;
	});

	public getUsersProjects(): Observable<PaginatedResponse<Project>> {
		const cachedState = this.userProjectsState();
		if (cachedState !== null) {
			return of(cachedState);
		}

		return this.http
			.get<PaginatedResponse<Project>>(this.getProjectsApiUrl)
			.pipe(tap((response) => this.userProjectsState.set(response)));
	}

	public getAllProjects(
		params?: Partial<PaginationParams>,
	): Observable<PaginatedResponse<Project>> {
		const httpParams = this.pagination.buildHttpParams(params);

		return this.http
			.get<PaginatedResponse<Project>>(this.getAllProjectsApiUrl, { params: httpParams })
			.pipe(tap((response) => this.allProjectsState.set(response)));
	}

	public getProjectBySlug(slug: string): Observable<ProjectFormData> {
		return this.http.get<ProjectFormData>(`${this.getProjectByIdApiUrl}/${slug}`);
	}

	public createProject(payload: ProjectFormData): Observable<any> {
		return this.http.post<any>(this.createProjectApiUrl, payload);
	}

	public updateProject(slug: string, payload: ProjectFormData): Observable<void> {
		const updatePayload = {
			slug: slug,
			...payload,
		};

		return this.http.put<void>(`${this.updateProjectApiUrl}/${slug}`, updatePayload);
	}

	public deleteProject(slug: string): Observable<void> {
		return this.http.delete<void>(`${this.deleteProjectApiUrl}/${slug}`);
	}
}
