import { Component, Input, Output, EventEmitter, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PermissionService } from '../../../services/permisions/permisions';
import { AuthService } from '../../../services/auth/auth.service';
import { Team, TeamService } from '../../../services/team/team.service';
import { StatusService } from '../../../services/status/status';

export interface ProjectFormData {
    id?: number;
    name: string;
    icon: string;
    theme: string;
    dueDate: string;
    teamId: number | string;
    statusId: number | string;
}

@Component({
    selector: 'app-project-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './project-form.component.html',
    styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly permissionService = inject(PermissionService);
    private readonly auth = inject(AuthService);
    private readonly teamService = inject(TeamService);
    private readonly statusService = inject(StatusService);

    @Input() submitLabel: string = 'Save Project';
    @Input() initialData: ProjectFormData | null = null;
    @Output() formSubmit = new EventEmitter<ProjectFormData>();

    public projectForm!: FormGroup;

    public canAssignTeam = computed(
        () => this.permissionService.hasPermission('Can Assign Teams', this.auth.currentUser())
    );

    public readonly availableTeams = computed<Team[]>(() => {
    if (this.canAssignTeam()) {
        return this.teamService.allTeamsState()?.items ?? [];
    }
    return this.teamService.myTeams() ?? [];
});

    public icons = ['bi-palette', 'bi-phone', 'bi-cpu', 'bi-bookmark-star', 'bi-laptop', 'bi-gear'];
    public themes = ['primary', 'emerald', 'amber', 'indigo', 'rose'];

    public statuses = computed(() => this.statusService.allStatuses() ?? []);

    ngOnInit(): void {
        // Fetch statuses if not already in store
        this.statusService.getAllStatuses().subscribe();

        // Populate team stores based on permissions
        this.teamService.getUserTeams().subscribe();
        if (this.canAssignTeam()) {
            this.teamService.getAllTeams().subscribe();
        }

        this.projectForm = this.fb.group({
            id: [this.initialData?.id || null],
            name: [this.initialData?.name || '', [Validators.required, Validators.minLength(3)]],
            icon: [this.initialData?.icon || 'bi-palette', Validators.required],
            theme: [this.initialData?.theme || 'primary', Validators.required],
            dueDate: [this.initialData?.dueDate || '', Validators.required],
            teamId: [this.initialData?.teamId || '', Validators.required],
            statusId: [this.initialData?.statusId || '', Validators.required],
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