import { Component, computed, effect, ElementRef, viewChild, input, signal } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Project } from '../../../services/project/project';

export type FilterScope = 'day' | 'week' | 'month';

@Component({
    selector: 'app-productivity-chart',
    standalone: true,
    templateUrl: './productivity-chart.html',
})
export class ProductivityChartComponent {
    projects = input<Project[]>([]);
    public readonly activeFilter = signal<FilterScope>('week');

    private canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
    private chart: Chart | null = null;

    private filteredProjects = computed(() => {
        const scope = this.activeFilter();
        const rawProjects = this.projects();
        const now = new Date();

        return rawProjects.filter(project => {
            const dateToCompare = project.updatedAt ? new Date(project.updatedAt) : new Date(); 
            const diffTime = Math.abs(now.getTime() - dateToCompare.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (scope === 'day') return diffDays <= 1;
            if (scope === 'week') return diffDays <= 7;
            if (scope === 'month') return diffDays <= 30;
            return true;
        });
    });

    private completedCount = computed(() => this.filteredProjects().filter(p => p.status === 'Completed').length);
    private inProgressCount = computed(() => this.filteredProjects().filter(p => p.status === 'In Progress' || p.status === 'On Track').length);
    private overdueCount = computed(() => this.filteredProjects().filter(p => p.status === 'At Risk').length);

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

    public setFilter(scope: FilterScope): void {
        this.activeFilter.set(scope);
    }
}