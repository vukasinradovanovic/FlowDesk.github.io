import { Component, inject, computed } from '@angular/core';
import { MainNavDashboard } from '../nav/main-nav-dashboard/main-nav-dashboard';
import { AuthService } from '../../services/auth/auth.service';
import { RoleService } from '../../services/role/role.service';
import { Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop'; // Import toObservable
import { of, switchMap } from 'rxjs'; // Import switchMap
import { AvatarComponent } from '../../dashboard/avatar.component/avatar.component';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [MainNavDashboard, AvatarComponent],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    private readonly router = inject(Router);
    private readonly roleService = inject(RoleService);
    public readonly auth = inject(AuthService);

    private currentUserId = computed(() => this.auth.currentUser()?.id);

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