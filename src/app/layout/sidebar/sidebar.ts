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

	private currentUser = computed(() => this.auth.currentUser());

	public userRoleName = toSignal(
		toObservable(this.currentUser).pipe(
			switchMap((user) => {
				return user ? of(user.role.name) : of('Loading...');
			}),
		),
		{ initialValue: 'Loading...' },
	);

	protected handleLogout(): void {
		this.auth.logout().subscribe({
			next: () => {
				this.router.navigate(['/']);
			},
			error: () => {
				this.router.navigate(['/']);
			},
		});
	}
}
