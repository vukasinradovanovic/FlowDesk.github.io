import { Component, inject, computed, HostListener, signal, ElementRef } from '@angular/core';
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
	private elementRef = inject(ElementRef);

	teams = this.teamService.allTeams;
	members = this.teamService.allMembers;

	public canCreateTeam = computed(
		() => this.auth.currentUser()?.permissions?.some((p) => p.name === 'Create Teams') ?? false,
	);

	public openDropdownId = signal<number | null>(null);

	public toggleDropdownProject(id: number, event: MouseEvent): void {
		event.stopPropagation();
		this.openDropdownId.update((currentId) => (currentId === id ? null : id));
	}

	@HostListener('document:click', ['$event'])
	onClickOutside(event: MouseEvent): void {
		if (this.openDropdownId() !== null && !this.elementRef.nativeElement.contains(event.target)) {
			this.openDropdownId.set(null);
		}
	}

	ngOnInit(): void {
		this.teamService.getTeams().subscribe();
	}
}
