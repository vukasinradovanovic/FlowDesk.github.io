import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, Observable, of, tap } from 'rxjs';

export interface Team {
    id: number;
    name: string;
    members?: number[];
}

export interface UserTeam {
    id: number;
    userId: number;
    teamId: number;
}

@Injectable({
    providedIn: 'root',
})
export class TeamService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    
    public readonly allTeams = signal<Team[] | null>(null);
    public readonly allUserTeams = signal<UserTeam[] | null>(null);

    private loadData(): Observable<{ teams: Team[], 'user-teams': UserTeam[] }> {
        const teamsCache = this.allTeams();
        const userTeamsCache = this.allUserTeams();

        if (teamsCache !== null && userTeamsCache !== null) {
            return of({ teams: teamsCache, 'user-teams': userTeamsCache });
        }   

        return this.http.get<{ teams: Team[], 'user-teams': UserTeam[] }>('/assets/data/data.json').pipe(
            tap((response) => {
                const rawUserTeams = response['user-teams'] || [];
                const parsedTeams = (response.teams || []).map(team => ({
                    ...team,
                    members: rawUserTeams.filter(ut => ut.teamId === team.id).map(ut => ut.userId)
                }));

                this.allUserTeams.set(rawUserTeams);
                this.allTeams.set(parsedTeams);
            }),
            map(() => ({ teams: this.allTeams()!, 'user-teams': this.allUserTeams()! }))
        );
    }

    public getTeams(): Observable<Team[]> {
        return this.loadData().pipe(
            map(data => data.teams)
        );
    }

    public getMyTeams(): Observable<Team[]> {
        return this.loadData().pipe(
            map(data => {
                const currentUserId = this.auth.currentUser()?.id ?? -1;
                
                const myTeamIds = data['user-teams']
                    .filter(ut => ut.userId === currentUserId)
                    .map(ut => ut.teamId);
                
                return data.teams.filter(t => myTeamIds.includes(t.id));
            })
        );
    }
}