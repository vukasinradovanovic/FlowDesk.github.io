import { Component, inject, computed } from '@angular/core';
import { MainNavDashboard } from '../nav/main-nav-dashboard/main-nav-dashboard';
import { AuthService } from '../../services/auth/auth.service';
import { RoleService } from '../../services/role/role.service';
import { Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop'; // Import toObservable
import { of, switchMap } from 'rxjs'; // Import switchMap

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [MainNavDashboard],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    private readonly router = inject(Router);
    private readonly roleService = inject(RoleService);
    public readonly auth = inject(AuthService);

    // 1. Monitor the user id cleanly as a signal
    private currentUserId = computed(() => this.auth.currentUser()?.id);

    // 2. Turn the ID signal into an observable, flatten it, and convert back to a Signal safely
    public userRoleName = toSignal(
        toObservable(this.currentUserId).pipe(
            switchMap((uid) => {
                return uid ? this.roleService.getUserRoleName(uid) : of('Guest');
            })
        ),
        { initialValue: 'Loading...' }
    );

    protected handleLogout(): void {
        this.auth.logout();
        this.router.navigate(['/']);
    }
}