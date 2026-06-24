import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface ProjectFormData {
    id?: number;
    name: string;
    icon: string;
    theme: string;
    progress: number;
    dueDate: string;
    status: string;
    teamId: number;
}

@Component({
    selector: 'app-project-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './project-form.component.html'
})
export class ProjectFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);

    @Input() submitLabel: string = 'Save Project';
    @Input() initialData: ProjectFormData | null = null;
	@Input() hasRangePicker: boolean = false;
    @Output() formSubmit = new EventEmitter<ProjectFormData>();

    public projectForm!: FormGroup;

    // Available style/meta pickers matched to your layout options
    public icons = ['bi-palette', 'bi-phone', 'bi-cpu', 'bi-bookmark-star', 'bi-laptop', 'bi-gear'];
    public themes = ['primary', 'emerald', 'amber', 'indigo', 'rose'];
    public statuses = ['In Progress', 'On Track', 'At Risk', 'Completed'];

    ngOnInit(): void {
        this.projectForm = this.fb.group({
            name: [this.initialData?.name || '', [Validators.required, Validators.minLength(3)]],
            icon: [this.initialData?.icon || 'bi-palette', Validators.required],
            theme: [this.initialData?.theme || 'primary', Validators.required],
            progress: [this.initialData?.progress ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],
            dueDate: [this.initialData?.dueDate || '', Validators.required],
            status: [this.initialData?.status || 'In Progress', Validators.required],
            teamId: [this.initialData?.teamId || 1, Validators.required]
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