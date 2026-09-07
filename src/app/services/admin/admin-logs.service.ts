import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface AdminLog {
	id: number | string;
	timestamp: string | Date | null;
	level: string;
	action: string;
	message: string;
	user: string;
	details: unknown;
}

@Injectable({ providedIn: 'root' })
export class AdminLogsService {
	private readonly http = inject(HttpClient);
	private readonly logsApiUrl = 'https://localhost:7175/api/GetUseCaseLog';

	public getLogs(): Observable<AdminLog[]> {
		return this.http.get<unknown>(this.logsApiUrl).pipe(map((response) => this.normalizeLogs(response)));
	}

	private normalizeLogs(response: unknown): AdminLog[] {
		return this.extractRecords(response).map((record, index) => ({
			id: String(this.value(record, 'id', 'Id') ?? index),
			timestamp: this.value(record, 'timestamp', 'Timestamp', 'createdAt', 'CreatedAt', 'date', 'Date') as string | Date | null,
			level: String(this.value(record, 'level', 'Level', 'severity', 'Severity') ?? 'Info'),
			action: String(this.value(record, 'action', 'Action', 'useCase', 'UseCase', 'event', 'Event') ?? 'System event'),
			message: String(this.value(record, 'message', 'Message', 'description', 'Description') ?? ''),
			user: String(this.value(record, 'userName', 'UserName', 'username', 'Username', 'email', 'Email') ?? 'System'),
			details: this.value(record, 'details', 'Details', 'data', 'Data') ?? record,
		}));
	}

	private extractRecords(response: unknown): Record<string, unknown>[] {
		if (Array.isArray(response)) return response.filter(this.isRecord);
		if (!this.isRecord(response)) return [];
		const records = response['items'] ?? response['Items'] ?? response['logs'] ?? response['Logs'] ?? response['data'];
		return Array.isArray(records) ? records.filter(this.isRecord) : [];
	}

	private value(record: Record<string, unknown>, ...keys: string[]): unknown {
		return keys.map((key) => record[key]).find((value) => value !== undefined && value !== null);
	}

	private isRecord(value: unknown): value is Record<string, unknown> {
		return typeof value === 'object' && value !== null;
	}
}