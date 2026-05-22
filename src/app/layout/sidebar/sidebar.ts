import { Component, inject } from '@angular/core';
import { MainNavDashboard } from '../nav/main-nav-dashboard/main-nav-dashboard';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
	selector: 'app-sidebar',
	imports: [MainNavDashboard],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.scss',
})
export class Sidebar {
	private readonly router = inject(Router);
	auth = inject(AuthService);

	protected handleLogout(): void {
		this.auth.logout();
		this.router.navigate(['/']);
	}
}
