import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../../services/auth/auth.service';
import { Project, ProjectService } from '../../../../services/project/project';
import { TeamService } from '../../../../services/team/team.service';

export interface TaskFormData {
	id?: number;
	name: string;
	description: string;
	dueDate: string;
	projectId: number | string;
	assignedUserId: number;
	attachments: File[];
}

@Component({
	selector: 'app-task-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterLink],
	templateUrl: './task-form.componnent.html',
	styleUrl: './task-form.componnent.scss',
})
export class TaskFormComponnent implements OnInit {
	private readonly fb = inject(FormBuilder);
	private readonly auth = inject(AuthService);
	private readonly projectService = inject(ProjectService);
	private readonly teamService = inject(TeamService);

	@Output() formSubmit = new EventEmitter<TaskFormData>();

	public readonly projects = computed<Project[]>(() => this.projectService.userProjectsState()?.items ?? []);
	public readonly assignedUsers = computed<User[]>(() => {
		const users = (this.teamService.myTeams()?.items ?? []).flatMap((team) => team.members ?? []);
		const currentUser = this.auth.currentUser();
		const allUsers = currentUser ? [...users, currentUser] : users;

		return Array.from(new Map(allUsers.map((user) => [user.id, user])).values());
	});

	public taskForm!: FormGroup;
	public selectedFiles: File[] = [];

	ngOnInit(): void {
		this.projectService.getUsersProjects().subscribe();
		this.teamService.getUserTeams().subscribe();

		this.taskForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			description: ['', [Validators.required]],
			dueDate: ['', [Validators.required]],
			projectId: ['', [Validators.required]],
			assignedUserId: [this.auth.currentUser()?.id ?? '', [Validators.required]],
		});
	}

	public onFilesSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.selectedFiles = Array.from(input.files ?? []);
	}

	public onSubmit(): void {
		if (this.taskForm.invalid) {
			this.taskForm.markAllAsTouched();
			return;
		}

		this.formSubmit.emit({
			...this.taskForm.getRawValue(),
			attachments: this.selectedFiles,
		});
	}
}
