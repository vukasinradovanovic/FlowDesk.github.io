import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap } from 'rxjs';
import { User } from '../auth/auth.service';

export interface Permission {
	id: number;
	name: string;
}

@Injectable({
	providedIn: 'root',
})
export class PermissionService {
	private readonly http = inject(HttpClient);

	public allPermissions = signal<Permission[] | null>(null);

	private readonly getPermissionsApiUrl = 'https://localhost:7175/api/getpermissions';

	public GetPermissions(): Observable<Permission[]> {
		return this.http
			.get<Permission[]>(`${this.getPermissionsApiUrl}`)
			.pipe(tap((permissions) => this.allPermissions.set(permissions)));
	}

	public hasPermission(permissionName: string, user: User | null | undefined): boolean {
		if (!user?.permissions) {
			return false;
		}
		return user.permissions.some((permission) => permission.name === permissionName);
	}
}
