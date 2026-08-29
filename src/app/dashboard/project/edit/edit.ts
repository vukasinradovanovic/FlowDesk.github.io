import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	ProjectFormComponent,
	ProjectFormData,
} from '../../forms/project-form.component/project-form.component';
import { ProjectService } from '../../../services/project/project';

@Component({
	selector: 'app-edit-project',
	standalone: true,
	imports: [ProjectFormComponent],
	templateUrl: './edit.html',
})
export class EditProject implements OnInit {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly ProjectService = inject(ProjectService);

	public projectSlug = signal<string | null>(null);
	public initialProjectData = signal<ProjectFormData | null>(null);

	ngOnInit(): void {
		const slugParam = this.route.snapshot.paramMap.get('slug');

		if (slugParam !== null) {
			this.projectSlug.set(slugParam);

			this.ProjectService.getProjectBySlug(slugParam).subscribe({
				next: (project: ProjectFormData) => this.initialProjectData.set(project),
				error: (err: unknown) => console.error('Failed to load project data', err),
			});
		}
	}

	public handleUpdate(payload: ProjectFormData): void {
		const slug = this.projectSlug();
		if (slug === null) return;

		this.ProjectService.updateProject(slug, payload).subscribe({
			next: () => {
				this.router.navigate(['/dashboard/projects']);
			},
			error: (err: unknown) => console.error('Failed to update project', err),
		});
	}
}
