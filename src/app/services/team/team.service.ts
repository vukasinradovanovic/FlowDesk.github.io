import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../auth/auth.service';
import { Observable, tap } from 'rxjs';
import { Project } from '../project/project';

export interface Team {
	id: number;
	name: string;
	projects?: Project[];
	members?: User[];
}

@Injectable({
	providedIn: 'root',
})
export class TeamService {
	private readonly http = inject(HttpClient);
	private readonly auth = inject(AuthService);

	private readonly getTeamsApiUrl = 'https://localhost:7175/api/getuserteams';

	public readonly allTeams = signal<Team[] | null>(null);

	public readonly allMembers = computed<User[]>(() => {
		const teams = this.allTeams();
		if (!teams) return [];

		const membersList = teams.flatMap((team) => team.members ?? []);

		return Array.from(new Map(membersList.map((user) => [user.id, user])).values());
	});

	public getTeams(): Observable<Team[]> {
		return this.http
			.get<Team[]>(this.getTeamsApiUrl)
			.pipe(tap((teams) => this.allTeams.set(teams)));
	}
}
