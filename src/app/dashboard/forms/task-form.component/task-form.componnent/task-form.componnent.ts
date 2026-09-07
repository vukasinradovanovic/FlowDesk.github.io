import { Component } from '@angular/core';

export interface TaskFormData {
	id?: number;
	name: string;
	description: string;
	dueDate: Date;
	updatedAt: Date;
	assignedUserId: number;
	TaskId: number;
	// status: Status;
}

@Component({
	selector: 'app-task-form.componnent',
	imports: [],
	templateUrl: './task-form.componnent.html',
	styleUrl: './task-form.componnent.scss',
})
export class TaskFormComponnent {}
