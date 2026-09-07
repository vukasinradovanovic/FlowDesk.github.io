import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
	TaskFormComponnent,
	TaskFormData,
} from '../../forms/task-form.component/task-form.componnent/task-form.componnent';
import { TasksService } from '../../../services/tasks/tasks.service';

@Component({
	selector: 'app-create',
	imports: [TaskFormComponnent],
	templateUrl: './create.html',
	styleUrl: './create.scss',
})
export class Create {
	private readonly router = inject(Router);
	private readonly tasksService = inject(TasksService);

	public handleCreate(payload: TaskFormData): void {
		const formData = new FormData();
		formData.append('Name', payload.name);
		formData.append('Description', payload.description);
		formData.append('DueDate', payload.dueDate);
		formData.append('ProjectId', String(payload.projectId));
		formData.append('AssignedUserId', String(payload.assignedUserId));

		for (const attachment of payload.attachments) {
			formData.append('Attachments', attachment, attachment.name);
		}

		this.tasksService.createTask(formData).subscribe({
			next: () => this.router.navigate(['/dashboard/tasks']),
			error: (error: unknown) => console.error('Failed to create task:', error),
		});
	}
}
