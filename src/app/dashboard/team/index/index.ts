import { Component, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Team, TeamService } from '../../../services/team/team.service';
import { AuthService, User } from '../../../services/auth/auth.service';
import { of, switchMap } from 'rxjs';
import { RoleService } from '../../../services/role/role.service';
import { PermissionService } from '../../../services/permisions/permisions';

@Component({
	selector: 'app-index',
	imports: [CommonModule, DatePipe],
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

	ngOnInit(): void {
		this.teamService.getTeams().subscribe();
	}

	// protected readonly authTrigger = toSignal(this.auth.currentUser(), {
	// 	initialValue: undefined,
	// });

	// getMemberDetails(id: number): Team | undefined {
	// 	const users = this.Team.usersData() || [];
	// 	return users.find((user) => user.id === id);
	// }

	// private currentUserId = computed(() => this.auth.currentUser()?.id);

	// public canCreateTeam = toSignal(
	//     toObservable(this.currentUserId).pipe(
	//         switchMap((uid) => {
	//             return uid ? this.permissionService.hasPermission(uid, 'Create Teams') : of(false);
	//         })
	//     ),
	//     { initialValue: false }
	// );
}
