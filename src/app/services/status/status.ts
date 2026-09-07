import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

export interface Status {
	id: number;
	name: string;
	theme: string;
}

@Injectable({
	providedIn: 'root',
})
export class StatusService {
	private readonly http = inject(HttpClient);

	private readonly getAllStatusesApiUrl = 'https://localhost:7175/api/getallstatuses';
	private readonly getStatusByIdApiUrl = 'https://localhost:7175/api/showstatus';

	public readonly allStatuses = signal<Status[] | null>(null);

	private loadStatuses(signal: typeof this.allStatuses, apiUrl: string): Observable<Status[]> {
		const cachedStatuses = signal();

		if (cachedStatuses !== null) {
			return of(cachedStatuses);
		}

		return this.http.get<Status[]>(apiUrl).pipe(tap((statuses) => signal.set(statuses)));
	}

	public getAllStatuses(): Observable<Status[]> {
		return this.loadStatuses(this.allStatuses, this.getAllStatusesApiUrl);
	}

	public getStatusById(id: number): Observable<Status> {
		return this.http.get<Status>(`${this.getStatusByIdApiUrl}/${id}`);
	}
}
