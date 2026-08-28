import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../../services/team/team.service';
import { PermissionService } from '../../../services/permisions/permisions';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
	selector: 'app-view-all-teams',
	imports: [CommonModule, DatePipe, RouterLink],
	templateUrl: './view-all-teams.html',
	styleUrl: './view-all-teams.scss',
})
export class ViewAllTeams {
	private readonly teamService = inject(TeamService);
	private readonly permissionService = inject(PermissionService);
	public readonly auth = inject(AuthService);

	public readonly today = new Date();
	private elementRef = inject(ElementRef);

	teams = this.teamService.allTeams;
    members = this.teamService.allMembers;

	public canCreateTeam = computed(() =>
		this.permissionService.hasPermission('Create Teams', this.auth.currentUser()),
	);

	public openDropdownId = signal<number | null>(null);

	public toggleDropdownProject(id: number, event: MouseEvent): void {
		event.stopPropagation();
		this.openDropdownId.update((currentId) => (currentId === id ? null : id));
	}

	public onDeleteTeam(id: number, event: MouseEvent): void {
		event.stopPropagation();
		this.openDropdownId.set(null);

		if (confirm('Are you sure you want to delete this team?')) {
			this.teamService.deleteTeam(id).subscribe({
				next: () => {
					console.log(`Team ${id} deleted successfully`);
					this.teamService.getUserTeams().subscribe();
				},
				error: (err: unknown) => {
					console.error('Failed to delete team:', err);
				},
			});
		}
	}

	@HostListener('document:click', ['$event'])
	onClickOutside(event: MouseEvent): void {
		if (this.openDropdownId() !== null && !this.elementRef.nativeElement.contains(event.target)) {
			this.openDropdownId.set(null);
		}
	}

	ngOnInit(): void {
		this.teamService.getAllTeams().subscribe();
	}
}
