import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Team, TeamService } from '../../../services/team/team.service';
import { PermissionService } from '../../../services/permisions/permisions';
import { AuthService, User } from '../../../services/auth/auth.service';
import { PaginationComponent } from '../../pagination.component/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-view-all-teams',
	imports: [CommonModule, DatePipe, RouterLink, FormsModule, PaginationComponent],
	templateUrl: './view-all-teams.html',
	styleUrl: './view-all-teams.scss',
})
export class ViewAllTeams {
	private readonly teamService = inject(TeamService);
    private readonly permissionService = inject(PermissionService);
    public readonly auth = inject(AuthService);
    private readonly elementRef = inject(ElementRef);

    public readonly today = new Date();

    public readonly currentPage = signal<number>(1);
    public readonly pageSize = signal<number>(10);
    public readonly searchTerm = signal<string>('');

    public readonly paginatedTeams = computed(() => this.teamService.allTeamsState());
    
    public readonly teams = computed<Team[]>(() => this.paginatedTeams()?.items ?? []);
    public readonly members = this.teamService.allMembers;

    public readonly totalPages = computed(() => this.paginatedTeams()?.totalPages ?? 1);
    public readonly totalCount = computed(() => this.paginatedTeams()?.totalCount ?? 0);

    public readonly canCreateTeam = computed(() =>
        this.permissionService.hasPermission('Create Teams', this.auth.currentUser())
    );

    public readonly openDropdownId = signal<number | null>(null);

    ngOnInit(): void {
        this.loadTeams();
    }

    public loadTeams(): void {
        this.teamService
            .getAllTeams({
                pageNumber: this.currentPage(),
                pageSize: this.pageSize(),
                searchTerm: this.searchTerm(),
            })
            .subscribe();
    }

    public goToPage(page: number): void {
        this.currentPage.set(page);
        this.loadTeams();
    }

    public onSearchChange(term: string): void {
        this.searchTerm.set(term);
        this.currentPage.set(1);
        this.loadTeams();
    }

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
                    this.loadTeams();
                    this.teamService.getUserTeams().subscribe();
                },
                error: (err: unknown) => {
                    console.error('Failed to delete team:', err);
                },
            });
        }
    }

    public getMemberById(id: number): User | undefined {
        return this.members().find((m) => m.id === id);
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent): void {
        if (
            this.openDropdownId() !== null &&
            !this.elementRef.nativeElement.contains(event.target as Node)
        ) {
            this.openDropdownId.set(null);
        }
    }
}
