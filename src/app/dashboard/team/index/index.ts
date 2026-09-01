import { Component, inject, computed, HostListener, signal, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Team, TeamService } from '../../../services/team/team.service';
import { AuthService, User } from '../../../services/auth/auth.service';
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
	private readonly permissionService = inject(PermissionService);
	public readonly auth = inject(AuthService);

	public readonly today = new Date();
	private elementRef = inject(ElementRef);

	public readonly teams = computed<Team[]>(() => {
		const response = this.teamService.myTeams();
		if (!response) return [];

		return Array.isArray(response) ? response : (response.items ?? []);
	});
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
		this.teamService.getUserTeams().subscribe();
	}

	public getMemberById(id: number): User | undefined {
        return this.members().find((m) => m.id === id);
    }
}
