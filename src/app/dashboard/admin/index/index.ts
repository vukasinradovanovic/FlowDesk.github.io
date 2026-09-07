import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AdminLog, AdminLogsService } from '../../../services/admin/admin-logs.service';

@Component({
	selector: 'app-index',
	imports: [CommonModule, DatePipe],
	templateUrl: './index.html',
	styleUrl: './index.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Index {
	private readonly logsService = inject(AdminLogsService);

	public readonly logs = signal<AdminLog[]>([]);
	public readonly isLoading = signal(true);
	public readonly hasError = signal(false);
	public readonly expandedLogId = signal<number | string | null>(null);

	constructor() {
		this.loadLogs();
	}

	public loadLogs(): void {
		this.isLoading.set(true);
		this.hasError.set(false);
		this.logsService.getLogs().subscribe({
			next: (logs) => {
				this.logs.set(logs);
				this.isLoading.set(false);
			},
			error: (error: unknown) => {
				console.error('Failed to load admin logs:', error);
				this.hasError.set(true);
				this.isLoading.set(false);
			},
		});
	}

	public toggleDetails(id: number | string): void {
		this.expandedLogId.update((current) => (current === id ? null : id));
	}

	public formatDetails(details: unknown): string {
		if (typeof details === 'string') return details;
		return JSON.stringify(details, null, 2);
	}
}
