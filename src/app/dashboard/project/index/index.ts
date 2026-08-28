import { Component, inject, computed, ElementRef, signal, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthService, User } from '../../../services/auth/auth.service';
import { ProjectService } from '../../../services/project/project';
import { TeamService } from '../../../services/team/team.service';
import { PermissionService } from '../../../services/permisions/permisions';
import { of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-index',
	imports: [DatePipe, CommonModule, RouterLink],
	templateUrl: './index.html',
	styleUrl: './index.scss',
})
export class Index {
	protected readonly currentDate = new Date();

	private readonly projectService = inject(ProjectService);
	private readonly teamService = inject(TeamService);
	private readonly permissionService = inject(PermissionService);
	public readonly auth = inject(AuthService);
	private elementRef = inject(ElementRef);

	public canCreateProjects = computed(
		() => this.permissionService.hasPermission('Create Projects', this.auth.currentUser())
	);

	isDropdownOpen = false;
	toggleDropdown(): void {
		this.isDropdownOpen = !this.isDropdownOpen;
	}
	selectedOption() {
		this.isDropdownOpen = false;
	}

	teams = toSignal(this.teamService.getUserTeams(), { initialValue: [] });

	public openDropdownSlug = signal<string | null>(null);

	public toggleDropdownProject(slug: string, event: MouseEvent): void {
		event.stopPropagation();
		if (this.openDropdownSlug() === slug) {
			this.openDropdownSlug.set(null);
		} else {
			this.openDropdownSlug.set(slug);
		}
	}

	@HostListener('document:click', ['$event'])
	onClickOutside(event: MouseEvent): void {
		if (this.openDropdownSlug() !== null && !this.elementRef.nativeElement.contains(event.target)) {
			this.openDropdownSlug.set(null);
		}
	}
}
