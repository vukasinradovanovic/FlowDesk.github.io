import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface TeamFormData {
    id?: number;
    name: string;
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

    @Input() submitLabel: string = 'Save Team';
    @Input() initialData: TeamFormData | null = null;
    @Output() formSubmit = new EventEmitter<TeamFormData>();

    public projectForm!: FormGroup;

    ngOnInit(): void {
        this.projectForm = this.fb.group({
            name: [this.initialData?.name || '', [Validators.required, Validators.minLength(3)]],
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
