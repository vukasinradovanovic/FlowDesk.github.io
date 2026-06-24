import { Component, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth/auth.service';
import { ProjectService } from '../../services/project/project';
import { ProductivityChartComponent } from '../charts/productivity-chart/productivity-chart';

// Define a type for our allowed filter scopes
export type FilterScope = 'day' | 'week' | 'month';

@Component({
	selector: 'app-index',
	standalone: true,
	imports: [DatePipe, ProductivityChartComponent],
	templateUrl: './index.html',
	styleUrl: './index.scss',
})
export class Index {
	private readonly projectService = inject(ProjectService);
	public readonly auth = inject(AuthService);
	public readonly today = new Date();

	public readonly allProjects = toSignal(this.projectService.getProjects(), { initialValue: [] });

	public readonly activeFilter = signal<FilterScope>('week');

	public readonly teamProjects = computed(() => {
		const filter = this.activeFilter();
		const projects = this.allProjects();

		return this.filterProjectsByScope(projects, filter);
	});

	public readonly completedCount = computed(() => this.allProjects().filter(p => p.status === 'Completed').length);
	public readonly inProgressCount = computed(() => this.allProjects().filter(p => p.status === 'In Progress' || p.status === 'On Track').length);
	public readonly overdueCount = computed(() => this.allProjects().filter(p => p.status === 'At Risk').length);

	public setFilter(scope: FilterScope): void {
		this.activeFilter.set(scope);
	}

	private readonly projects = toSignal(this.projectService.getProjects(), { initialValue: [] });

    public readonly projectsCount = computed(() => this.projects().length);

	private filterProjectsByScope(projects: any[], scope: FilterScope): any[] {
		const now = new Date();
		return projects.filter(project => {
			if (!project.updatedAt) return true; // fallback
			const projectDate = new Date(project.updatedAt);
			const diffTime = Math.abs(now.getTime() - projectDate.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			if (scope === 'day') return diffDays <= 1;
			if (scope === 'week') return diffDays <= 7;
			if (scope === 'month') return diffDays <= 30;
			return true;
		});
	}
}