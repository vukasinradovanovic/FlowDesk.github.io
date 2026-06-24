import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap } from 'rxjs';

export interface Permission {
    id: number;
    name: string;
}

export interface UserRoleMapping {
    id: number;
    userId: number;
    roleId: number;
    permissions: number[]; // Array of permission IDs
}

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    private readonly http = inject(HttpClient);

    // Reactive cache stores for your JSON datasets
    public readonly allPermissions = signal<Permission[] | null>(null);
    public readonly allUserRoles = signal<UserRoleMapping[] | null>(null);

    /**
     * Loads the structural initial datasets from data.json if not already cached
     */
    private loadPermissionData(): Observable<{ permissions: Permission[]; 'user-roles': UserRoleMapping[] }> {
        const permsCache = this.allPermissions();
        const userRolesCache = this.allUserRoles();

        if (permsCache !== null && userRolesCache !== null) {
            return of({ permissions: permsCache, 'user-roles': userRolesCache });
        }

        return this.http
            .get<{ permisions: Permission[]; 'user-roles': UserRoleMapping[] }>('/assets/data/data.json')
            .pipe(
                tap((response) => {
                    const rawPermissions = response.permisions || [];
                    const rawUserRoles = response['user-roles'] || [];

                    this.allPermissions.set(rawPermissions);
                    this.allUserRoles.set(rawUserRoles);
                }),
                map((response) => ({
                    permissions: response.permisions || [], 
                    'user-roles': response['user-roles'] || [],
                }))
            );
    }

    public getUserPermissions(userId: number): Observable<string[]> {
        return this.loadPermissionData().pipe(
            map(({ permissions, 'user-roles': userRoles }) => {
                const userMappings = userRoles.filter((ur) => ur.userId === userId);

                const assignedPermissionIds = new Set<number>();
                userMappings.forEach((mapping) => {
                    mapping.permissions?.forEach((id) => assignedPermissionIds.add(id));
                });

                const permissionNames = permissions
                    .filter((p) => assignedPermissionIds.has(p.id))
                    .map((p) => p.name);

                if (permissionNames.includes('Full Access')) {
                    return permissions.map((p) => p.name);
                }

                return permissionNames;
            })
        );
    }

    public hasPermission(userId: number, requiredPermission: string): Observable<boolean> {
        return this.getUserPermissions(userId).pipe(
            map((userPerms) => userPerms.includes(requiredPermission))
        );
    }
}