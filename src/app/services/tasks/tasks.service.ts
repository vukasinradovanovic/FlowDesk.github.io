import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponse, Pagination, PaginationParams } from '../pagination/pagination';
import { Status } from '../status/status';
import { Observable, tap } from 'rxjs';
import { TaskFormData } from '../../dashboard/forms/task-form.component/task-form.componnent/task-form.componnent';

export interface Task {
	id: number;
	name: string;
	slug: string;
	description: string;
	createdAt: Date;
	dueDate: Date;
	updatedAt: Date;
	assignedUserId: number;
	TaskId: number;
	statusId?: number;
	status?: Status;
}

@Injectable({
	providedIn: 'root',
})
export class TasksService {
	private readonly auth = inject(AuthService);
	private readonly http = inject(HttpClient);
	private readonly pagination = inject(Pagination);

	private readonly getUsersTasksApiUrl = 'https://localhost:7175/api/getusertasks';
	private readonly createTaskApiUrl = 'https://localhost:7175/api/createtask';
	private readonly getAllTasksApiUrl = 'https://localhost:7175/api/getalltasks';
	private readonly getTaskBySlugApiUrl = 'https://localhost:7175/api/showtask';
	private readonly updateTaskApiUrl = 'https://localhost:7175/api/updatetask';
	private readonly deleteTaskApiUrl = 'https://localhost:7175/api/deletetask';

	public readonly userTasksState = signal<PaginatedResponse<Task> | null>(null);
	public readonly allTasksState = signal<PaginatedResponse<Task> | null>(null);
	public readonly currentTask = signal<Task | null>(null);

	public readonly allUsersTasks = computed(() => {
		const state = this.userTasksState() as any;
		return state?.items ?? state?.Items ?? [];
	});

	public readonly totalUserTasksCount = computed(() => {
		const state = this.userTasksState() as any;
		if (!state) return 0;

		return state.totalCount ?? state.TotalCount ?? state.items?.length ?? state.Items?.length ?? 0;
	});

	public getUsersTasks(
		params?: Partial<PaginationParams>,
	): Observable<PaginatedResponse<Task>> {
		const httpParams = this.pagination.buildHttpParams(params);

		return this.http
			.get<PaginatedResponse<Task>>(this.getUsersTasksApiUrl, { params: httpParams })
			.pipe(tap((response) => this.userTasksState.set(response)));
	}

	public getAllTasks(
		params?: Partial<PaginationParams>,
	): Observable<PaginatedResponse<Task>> {
		const httpParams = this.pagination.buildHttpParams(params);

		return this.http
			.get<PaginatedResponse<Task>>(this.getAllTasksApiUrl, { params: httpParams })
			.pipe(tap((response) => this.allTasksState.set(response)));
	}

	public getTaskBySlug(slug: string): Observable<Task> {
		this.currentTask.set(null);

		return this.http
			.get<Task>(`${this.getTaskBySlugApiUrl}/${slug}`)
			.pipe(tap((task) => this.currentTask.set(task)));
	}

	public createTask(payload: TaskFormData): Observable<any> {
		return this.http.post<any>(this.createTaskApiUrl, payload);
	}

	public updateTask(slug: string, payload: TaskFormData): Observable<void> {
		const updatePayload = {
			slug: slug,
			...payload,
		};

		return this.http.put<void>(`${this.updateTaskApiUrl}/${slug}`, updatePayload);
	}

	public deleteTask(slug: string): Observable<void> {
		return this.http.delete<void>(`${this.deleteTaskApiUrl}/${slug}`);
	}
}
