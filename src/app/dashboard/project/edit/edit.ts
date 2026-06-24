import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectFormComponent, ProjectFormData } from '../../forms/project-form.component/project-form.component';
import { ProjectService } from '../../../services/project/project';

@Component({
    selector: 'app-edit-project',
    standalone: true,
    imports: [ProjectFormComponent],
    templateUrl: './edit.html',
})
export class EditProject implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly projectService = inject(ProjectService);
    private readonly router = inject(Router);

    public projectToEdit = signal<ProjectFormData | null>(null);

    ngOnInit(): void {
        const slug = this.route.snapshot.paramMap.get('slug');
        
        if (slug) {
            // 🔍 FIX: Subscribe to the Observable stream returned by the service
            this.projectService.getProjectBySlug(slug).subscribe({
                next: (project) => {
                    if (project) {
                        // Map the Date object back to a clean string format (YYYY-MM-DD) for your HTML date picker input
                        const formattedProject: ProjectFormData = {
                            ...project,
                            dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ''
                        };
                        this.projectToEdit.set(formattedProject);
                    } else {
                        console.error(`Project with slug "${slug}" not found.`);
                        this.router.navigate(['/dashboard/projects']);
                    }
                },
                error: (err) => {
                    console.error('Failed to load project details:', err);
                    this.router.navigate(['/dashboard/projects']);
                }
            });
        }
    }

    public handleUpdate(payload: ProjectFormData): void {
        console.log('Updating entity updates onto persistent storage structures:', payload);
        // Here you would connect to a service method like this.projectService.updateProject(payload)
        this.router.navigate(['/dashboard/projects']);
    }
}