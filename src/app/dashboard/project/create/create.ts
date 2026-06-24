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
        // Here you would connect to your project data service to push to your mock array database
        this.router.navigate(['/dashboard/projects']);
    }
}