import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../auth/auth.service';
import { Observable, tap } from 'rxjs';
import { Project } from '../project/project';
import { TeamFormData } from '../../dashboard/forms/team-form.component/team-form.component';

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

	private readonly getUserTeamsApiUrl = 'https://localhost:7175/api/getuserteams';
	private readonly getAllTeamsApiUrl = 'https://localhost:7175/api/getallteams';
	private readonly createTeamApiUrl = 'https://localhost:7175/api/createteam';
	private readonly getTeamByIdApiUrl = 'https://localhost:7175/api/showteam';
	private readonly updateTeamApiUrl = 'https://localhost:7175/api/updateteam';
	private readonly deleteTeamApiUrl = 'https://localhost:7175/api/deleteteam';

	public readonly allTeams = signal<Team[] | null>(null);
	public readonly myTeams = signal<Team[] | null>(null);

	public readonly allMembers = computed<User[]>(() => {
		const teams = this.allTeams();
		if (!teams) return [];

		const membersList = teams.flatMap((team) => team.members ?? []);

		return Array.from(new Map(membersList.map((user) => [user.id, user])).values());
	});

	public getUserTeams(): Observable<Team[]> {
		return this.http
			.get<Team[]>(this.getUserTeamsApiUrl)
			.pipe(tap((teams) => this.myTeams.set(teams)));
	}
	
	public getAllTeams(): Observable<Team[]> {
		return this.http
			.get<Team[]>(this.getAllTeamsApiUrl)
			.pipe(tap((teams) => this.allTeams.set(teams)));
	}

	public createTeam(payload: TeamFormData): Observable<any> {
		return this.http.post<any>(this.createTeamApiUrl, payload);
	}

	public getTeamById(id: number): Observable<TeamFormData> {
		return this.http.get<TeamFormData>(`${this.getTeamByIdApiUrl}/${id}`);
	}

	public updateTeam(id: number, payload: TeamFormData): Observable<void> {
		const updatePayload = {
			id: id,
			...payload,
		};

		return this.http.put<void>(`${this.updateTeamApiUrl}/${id}`, updatePayload);
	}

	public deleteTeam(id: number): Observable<void> {
		return this.http.delete<void>(`${this.deleteTeamApiUrl}/${id}`);
	}
}
