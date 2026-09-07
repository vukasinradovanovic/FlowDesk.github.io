import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, map, of, switchMap } from 'rxjs';
import { Status, StatusService } from '../../../services/status/status';
import { Task, TasksService } from '../../../services/tasks/tasks.service';

@Component({
	selector: 'app-show',
	imports: [CommonModule, DatePipe, RouterLink],
	templateUrl: './show.html',
	styleUrl: './show.scss',
})
export class Show implements OnInit {
	private readonly apiOrigin = 'https://localhost:7175';
	private readonly http = inject(HttpClient);
	private readonly route = inject(ActivatedRoute);
	private readonly tasksService = inject(TasksService);
	private readonly statusService = inject(StatusService);
	private readonly destroyRef = inject(DestroyRef);

	public readonly task = signal<Task | null>(null);
	public readonly status = signal<Status | null>(null);
	public readonly isLoading = signal(true);
	public readonly hasError = signal(false);

	public attachmentUrl(filePath: string): string {
		if (/^https?:\/\//i.test(filePath)) return filePath;
		return `${this.apiOrigin}/${filePath.replace(/^\/+/, '')}`;
	}

	public formatFileSize(fileSize: number): string {
		if (fileSize < 1024) return `${fileSize} B`;
		if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
		return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
	}

	public downloadAttachment(filePath: string, fileName: string): void {
		this.http.get(this.attachmentUrl(filePath), { responseType: 'blob' }).subscribe({
			next: (file) => {
				const downloadUrl = URL.createObjectURL(file);
				const link = document.createElement('a');
				link.href = downloadUrl;
				link.download = fileName;
				link.click();
				URL.revokeObjectURL(downloadUrl);
			},
			error: (error: unknown) => console.error('Failed to download attachment:', error),
		});
	}

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
