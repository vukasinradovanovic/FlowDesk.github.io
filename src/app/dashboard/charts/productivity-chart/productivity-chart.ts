import { Component, computed, inject, effect, ElementRef, viewChild, input } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Project } from '../../../services/project/project';

@Component({
	selector: 'app-productivity-chart',
	standalone: true,
	template: `
		<div style="position: relative; height: 110px;">
			<canvas #chartCanvas></canvas>
		</div>
	`
})
export class ProductivityChartComponent {
	// Receive projects signal dynamically from the parent component
	projects = input<Project[]>([]);

	private canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
	private chart: Chart | null = null;

	// Keep data calculations isolated inside the presentation component
	private completedCount = computed(() => this.projects().filter(p => p.status === 'Completed').length);
	private inProgressCount = computed(() => this.projects().filter(p => p.status === 'In Progress' || p.status === 'On Track').length);
	private overdueCount = computed(() => this.projects().filter(p => p.status === 'At Risk').length);

	constructor() {
		effect(() => {
			const canvas = this.canvasRef()?.nativeElement;
			if (!canvas) return;

			const dataValues = [this.completedCount(), this.inProgressCount(), this.overdueCount()];

			if (this.chart) {
				this.chart.data.datasets[0].data = dataValues;
				this.chart.update();
			} else {
				this.chart = new Chart(canvas, {
					type: 'bar',
					data: {
						labels: ['Completed', 'In Progress', 'Overdue'],
						datasets: [{
							label: 'Tasks Overview',
							data: dataValues,
							backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
							borderRadius: 6
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: { legend: { display: false } },
						scales: {
							y: { beginAtZero: true, grid: { display: false } },
							x: { grid: { display: false } }
						}
					}
				});
			}
		});
	}
}