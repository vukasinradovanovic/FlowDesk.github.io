import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../../services/auth/auth.service';
import { Project, ProjectService } from '../../../../services/project/project';
import { StatusService } from '../../../../services/status/status';
import { TeamService } from '../../../../services/team/team.service';

export interface TaskFormData {
	id?: number;
	name: string;
	description: string;
	dueDate: string;
	projectId: number | string;
	assignedUserId: number;
	statusId: number | string;
	attachments: File[];
}

@Component({
	selector: 'app-task-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterLink],
	templateUrl: './task-form.componnent.html',
	styleUrl: './task-form.componnent.scss',
})
export class TaskFormComponnent implements OnInit, OnChanges {
	private readonly fb = inject(FormBuilder);
	private readonly auth = inject(AuthService);
	private readonly projectService = inject(ProjectService);
	private readonly statusService = inject(StatusService);
	private readonly teamService = inject(TeamService);

	@Output() formSubmit = new EventEmitter<TaskFormData>();
	@Input() submitLabel = 'Create Task';
	@Input() initialData: TaskFormData | null = null;

	public readonly projects = computed<Project[]>(() => this.projectService.userProjectsState()?.items ?? []);
	public readonly statuses = computed(() => this.statusService.allStatuses() ?? []);
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
		this.statusService.getAllStatuses().subscribe();

		this.taskForm = this.fb.group({
			name: [this.initialData?.name ?? '', [Validators.required, Validators.minLength(3)]],
			description: [this.initialData?.description ?? '', [Validators.required]],
			dueDate: [this.initialData?.dueDate ?? '', [Validators.required]],
			projectId: [this.initialData?.projectId ?? '', [Validators.required]],
			assignedUserId: [this.initialData?.assignedUserId ?? this.auth.currentUser()?.id ?? '', [Validators.required]],
			statusId: [this.initialData?.statusId ?? '', [Validators.required]],
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['initialData'] && this.taskForm && this.initialData) {
			this.taskForm.patchValue({
				name: this.initialData.name,
				description: this.initialData.description,
				dueDate: this.initialData.dueDate,
				projectId: this.initialData.projectId,
				assignedUserId: this.initialData.assignedUserId,
				statusId: this.initialData.statusId,
			});
		}
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
