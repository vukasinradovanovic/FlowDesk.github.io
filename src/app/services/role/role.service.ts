import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

export interface Role {
	id: number;
	name: string;
}

@Injectable({
	providedIn: 'root',
})
export class RoleService {
	public readonly http = inject(HttpClient);
	public readonly allRoles = signal<Role[] | null>(null);


}
