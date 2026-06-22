import { Component, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService, User } from '../../../services/auth/auth.service';
import { Project, ProjectService } from '../../../services/project/project';
import { Team, TeamService } from '../../../services/team/team.service';

@Component({
	selector: 'app-index',
	imports: [DatePipe, CommonModule],
	templateUrl: './index.html',
	styleUrl: './index.scss',
})
export class Index {
	protected readonly Date = Date;

	private readonly projectService = inject(ProjectService);
	private readonly teamService = inject(TeamService);
	public readonly auth = inject(AuthService);

	isDropdownOpen = false;
	toggleDropdown(): void {
		this.isDropdownOpen = !this.isDropdownOpen;
	}
	selectedOption() {
		this.isDropdownOpen = false;
	}

	teams = toSignal(this.teamService.getTeams(), { initialValue: [] });
	teamProjects = toSignal(this.projectService.getProjects(), { initialValue: [] });

	authTrigger = toSignal(this.auth.getMembersById(-1), { initialValue: undefined });

	getMemberDetails = computed(() => {
		const users = this.auth.usersData() || [];
		return (id: number): User | undefined => users.find((user) => user.id === id);
	});

	getTeamName = computed(() => {
		const currentTeams = this.teams();
		return (teamId: number): string => {
			const team = currentTeams.find((t) => t.id === teamId);
			return team ? team.name : `Team #${teamId}`;
		};
	});
}
