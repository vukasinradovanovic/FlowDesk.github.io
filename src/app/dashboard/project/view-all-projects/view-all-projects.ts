import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { ProjectService } from '../../../services/project/project';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../../services/team/team.service';
import { PermissionService } from '../../../services/permisions/permisions';
import { AuthService } from '../../../services/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-view-all-projects',
	imports: [DatePipe, CommonModule, RouterLink],
	templateUrl: './view-all-projects.html',
	styleUrl: './view-all-projects.scss',
})
export class ViewAllProjects {
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

	teams = toSignal(this.teamService.getAllTeams(), { initialValue: [] });

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
