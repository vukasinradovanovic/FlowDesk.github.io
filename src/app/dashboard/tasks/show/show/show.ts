import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, map, of, switchMap } from 'rxjs';
import { Status, StatusService } from '../../../../services/status/status';
import { Task, TasksService } from '../../../../services/tasks/tasks.service';

@Component({
	selector: 'app-show',
	imports: [CommonModule, DatePipe, RouterLink],
	templateUrl: './show.html',
	styleUrl: './show.scss',
})
export class Show implements OnInit {
	private readonly route = inject(ActivatedRoute);
	private readonly tasksService = inject(TasksService);
	private readonly statusService = inject(StatusService);
	private readonly destroyRef = inject(DestroyRef);

	public readonly task = signal<Task | null>(null);
	public readonly status = signal<Status | null>(null);
	public readonly isLoading = signal(true);
	public readonly hasError = signal(false);

	ngOnInit(): void {
		this.route.paramMap
			.pipe(
				switchMap((params) => {
					const slug = params.get('slug');
					if (!slug) return EMPTY;
						return this.tasksService.getTaskBySlug(slug).pipe(
							switchMap((taskData) => {
								const statusId = taskData.statusId ?? taskData.status?.id;

								if (statusId === undefined) {
									return of({ task: taskData, status: taskData.status ?? null });
								}

								return this.statusService
									.getStatusById(statusId)
									.pipe(map((status) => ({ task: taskData, status })));
							}),
						);
				}),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe({
				next: (taskData) => {
					this.task.set(taskData.task);
					this.status.set(taskData.status);
					this.isLoading.set(false);
				},
				error: (err) => {
					console.error('Request failed with error:', err);
					this.hasError.set(true);
					this.isLoading.set(false);
				},
			});
	}
}
