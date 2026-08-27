import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectFormComponent, ProjectFormData } from '../../forms/project-form.component/project-form.component';

@Component({
    selector: 'app-create-project',
    standalone: true,
    imports: [ProjectFormComponent],
    templateUrl: './create.html', 
})
export class CreateProject {
    private readonly router = inject(Router);

    public handleCreate(payload: ProjectFormData): void {
        console.log('Sending new record creation properties to JSON backend payload maps:', payload);
        this.router.navigate(['/dashboard/projects']);
    }
}