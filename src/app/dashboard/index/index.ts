import { Component, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth/auth.service';
import { ProjectService } from '../../services/project/project';
import { ProductivityChartComponent } from './productivity-chart.component'; // Import here

@Component({
	selector: 'app-index',
	standalone: true,
	imports: [DatePipe, ProductivityChartComponent], // Add to imports
	templateUrl: './index.html',
	styleUrl: './index.scss',
})
export class Index {
	private readonly projectService = inject(ProjectService);
	auth = inject(AuthService);

	public teamProjects = toSignal(this.projectService.getProjects(), { initialValue: [] });

	// Keep these computed signals here only if your text stat blocks underneath still need them
	public completedCount = computed(() => this.teamProjects().filter(p => p.status === 'Completed').length);
	public inProgressCount = computed(() => this.teamProjects().filter(p => p.status === 'In Progress' || p.status === 'On Track').length);
	public overdueCount = computed(() => this.teamProjects().filter(p => p.status === 'At Risk').length);
}