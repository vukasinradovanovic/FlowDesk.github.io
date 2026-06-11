import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { UserTeam } from '../team/team.service';

export interface Role {
	id: number;
	name: string;
}

export interface UserRoles {
	id: number;
	userId: number;
	roleId: number;
	permissions?: string[];
}

@Injectable({
	providedIn: 'root',
})

export class RoleService {
	public readonly http = inject(HttpClient);
	public readonly allRoles = signal<Role[] | null>(null);
	public readonly allUserRoles = signal<UserRoles[] | null>(null);

	private loadInitialData(): Observable<{ roles: Role[], 'user-roles': UserRoles[] }> {
		const rolesCache = this.allRoles();
		const userRolesCache = this.allUserRoles();

		if (rolesCache !== null && userRolesCache !== null) {
			return of({ roles: rolesCache, 'user-roles': userRolesCache });
		}

		return this.http
			.get<{ roles: Role[]; 'user-roles': UserRoles[] }>('/assets/data/data.json')
			.pipe(
				tap((response) => {
					const rawUserRoles = response['user-roles'] || [];
					const parsedRoles = (response.roles || []).map((role) => ({
						...role,
						members: rawUserRoles.filter((ur) => ur.roleId === role.id).map((ut) => ut.userId),
					}));

					this.allUserRoles.set(rawUserRoles);
					this.allRoles.set(parsedRoles);
				}),
				map(() => ({ roles: this.allRoles()!, 'user-roles': this.allUserRoles()! })),
			);
	}
}
