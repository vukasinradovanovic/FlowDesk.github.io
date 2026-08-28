import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectFormComponent, ProjectFormData } from '../../forms/project-form.component/project-form.component';
import { ProjectService } from '../../../services/project/project';

@Component({
    selector: 'app-create-project',
    standalone: true,
    imports: [ProjectFormComponent],
    templateUrl: './create.html', 
})
export class CreateProject {
    private readonly router = inject(Router);
    private readonly projectService = inject(ProjectService);

    public handleCreate(payload: ProjectFormData): void {
            this.projectService.createProject(payload).subscribe({
                next: (response) => {
                    console.log('Project created successfully:', response);
                    this.router.navigate(['/dashboard/projects']);
                },
                error: (err) => {
                    console.error('Failed to create project:', err);
                },
            });
        }
}