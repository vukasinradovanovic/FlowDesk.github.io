import { Component, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Team, TeamService } from '../../../services/team/team.service';
import { AuthService, User } from '../../../services/auth/auth.service';
import { of, switchMap } from 'rxjs';
import { RoleService } from '../../../services/role/role.service';
import { PermissionService } from '../../../services/permisions/permisions';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-index',
	imports: [CommonModule, DatePipe, RouterLink],
	templateUrl: './index.html',
	styleUrl: './index.scss',
})
export class Index {
	private readonly teamService = inject(TeamService);
	// public readonly roleService = inject(RoleService);
	// public readonly permissionService = inject(PermissionService);

	public readonly auth = inject(AuthService);

	public readonly today = new Date();

	teams = this.teamService.allTeams;
	members = this.teamService.allMembers;

	public canCreateTeam = computed(() => this.auth.currentUser()?.permissions?.some((p) => p.name === 'Create Teams') ?? false);

	ngOnInit(): void {
		this.teamService.getTeams().subscribe();
	}
}
