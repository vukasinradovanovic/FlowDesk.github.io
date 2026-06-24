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
	protected readonly Date = Date;

	private readonly projectService = inject(ProjectService);
	private readonly teamService = inject(TeamService);
	private readonly permisionsService = inject(PermissionService);
	public readonly auth = inject(AuthService);
	private elementRef = inject(ElementRef);

	public readonly permissoion = 'Create Projects';

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

	private currentUserId = computed(() => this.auth.currentUser()?.id);

    public canCreateProject = toSignal(
        toObservable(this.currentUserId).pipe(
            switchMap((uid) => {
                return uid ? this.permisionsService.hasPermission(uid, this.permissoion) : of(false);
            })
        ),
        { initialValue: false }
    );

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
