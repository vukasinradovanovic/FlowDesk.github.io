import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth/auth.service';

export interface TeamFormData {
    id?: number;
    name: string;
	userIds?: number[];
	members?: User[];
}

@Component({
	selector: 'app-team-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterLink],
	templateUrl: './team-form.component.html',
	styleUrl: './team-form.component.scss',
})
export class TeamFormComponent implements OnInit{
	private readonly fb = inject(FormBuilder);
    private readonly auth = inject(AuthService);

    @Input() submitLabel: string = 'Save Team';
    @Input() initialData: TeamFormData | null = null;
    @Output() formSubmit = new EventEmitter<TeamFormData>();

    public projectForm!: FormGroup;
	public readonly users = this.auth.usersData;

    ngOnInit(): void {
		this.auth.getAllUsers().subscribe({
			error: (error: unknown) => console.error('Failed to load users:', error),
		});

        this.projectForm = this.fb.group({
            name: [this.initialData?.name || '', [Validators.required, Validators.minLength(3)]],
            userIds: [this.initialData?.userIds ?? this.initialData?.members?.map((user) => user.id) ?? []],
        });
    }

    public onSubmit(): void {
        if (this.projectForm.valid) {
            this.formSubmit.emit(this.projectForm.value);
        } else {
            this.projectForm.markAllAsTouched();
        }
    }
}
