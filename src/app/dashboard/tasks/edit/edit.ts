import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	TaskFormComponnent,
	TaskFormData,
} from '../../forms/task-form.component/task-form.componnent/task-form.componnent';
import { Task, TasksService } from '../../../services/tasks/tasks.service';

@Component({
	selector: 'app-edit',
	imports: [TaskFormComponnent],
	templateUrl: './edit.html',
	styleUrl: './edit.scss',
})
export class Edit implements OnInit {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly tasksService = inject(TasksService);

	public readonly taskSlug = signal<string | null>(null);
	public readonly initialTaskData = signal<TaskFormData | null>(null);

	ngOnInit(): void {
		const slug = this.route.snapshot.paramMap.get('slug');
		if (!slug) return;

		this.taskSlug.set(slug);
		this.tasksService.getTaskBySlug(slug).subscribe({
			next: (task) => this.initialTaskData.set(this.toFormData(task)),
			error: (error: unknown) => console.error('Failed to load task data:', error),
		});
	}

	public handleUpdate(payload: TaskFormData): void {
		const slug = this.taskSlug();
		if (!slug) return;

		const formData = new FormData();
		formData.append('Slug', slug);
		if (payload.id !== undefined) {
			formData.append('Id', String(payload.id));
		}
		formData.append('Name', payload.name);
		formData.append('Description', payload.description);
		formData.append('DueDate', payload.dueDate);
		formData.append('ProjectId', String(payload.projectId));
		formData.append('AssignedUserId', String(payload.assignedUserId));
		formData.append('StatusId', String(payload.statusId));

		for (const attachment of payload.attachments) {
			formData.append('Attachments', attachment, attachment.name);
		}

		this.tasksService.updateTask(slug, formData).subscribe({
			next: () => this.router.navigate(['/dashboard/tasks']),
			error: (error: { error?: { errors?: unknown } }) => {
				console.error('Failed to update task:', error);
				console.error('Update validation details:', error.error?.errors ?? error.error);
			},
		});
	}

	private toFormData(task: Task): TaskFormData {
		return {
			id: task.id,
			name: task.name,
			description: task.description,
			dueDate: this.toDateInputValue(task.dueDate),
			projectId: task.projectId,
			assignedUserId: task.assignedUserId,
			statusId: task.status?.id ?? '',
			attachments: [],
		};
	}

	private toDateInputValue(value: Date | string): string {
		return new Date(value).toISOString().slice(0, 10);
	}
}
