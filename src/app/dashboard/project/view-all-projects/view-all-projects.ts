import {
	Component,
	computed,
	ElementRef,
	HostListener,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProjectService, Project } from '../../../services/project/project';
import { ProjectWithTeam, Team, TeamService } from '../../../services/team/team.service';
import { PermissionService } from '../../../services/permisions/permisions';
import { AuthService } from '../../../services/auth/auth.service';
import { PaginationComponent } from '../../pagination.component/pagination.component';
import { map } from 'rxjs';

@Component({
	selector: 'app-view-all-projects',
	standalone: true,
	imports: [DatePipe, CommonModule, RouterLink, FormsModule, PaginationComponent],
	templateUrl: './view-all-projects.html',
	styleUrl: './view-all-projects.scss',
})
export class ViewAllProjects implements OnInit {
	protected readonly currentDate = new Date();

    private readonly projectService = inject(ProjectService);
    private readonly permissionService = inject(PermissionService);
    public readonly auth = inject(AuthService);
    private readonly elementRef = inject(ElementRef);

    // Pagination Signals
    public readonly currentPage = signal<number>(1);
    public readonly pageSize = signal<number>(10);
    public readonly searchTerm = signal<string>('');

    // State Signal
    public readonly paginatedProjects = computed(() => this.projectService.allProjectsState());
    
    public readonly projects = computed<Project[]>(() => this.paginatedProjects()?.items ?? []);

    // Metadata
    public readonly totalPages = computed(() => this.paginatedProjects()?.totalPages ?? 1);
    public readonly totalCount = computed(() => this.paginatedProjects()?.totalCount ?? 0);

    // Permissions
    public readonly canCreateProjects = computed(() =>
        this.permissionService.hasPermission('Create Projects', this.auth.currentUser())
    );

    public readonly openDropdownSlug = signal<string | null>(null);

    ngOnInit(): void {
        this.loadProjects();
    }

    public loadProjects(): void {
        this.projectService
            .getAllProjects({
                pageNumber: this.currentPage(),
                pageSize: this.pageSize(),
                searchTerm: this.searchTerm(),
            })
            .subscribe();
    }

    public goToPage(page: number): void {
        this.currentPage.set(page);
        this.loadProjects();
    }

    public onSearchChange(term: string): void {
        this.searchTerm.set(term);
        this.currentPage.set(1);
        this.loadProjects();
    }

    public toggleDropdownProject(slug: string, event: MouseEvent): void {
        event.stopPropagation();
        this.openDropdownSlug.update((curr) => (curr === slug ? null : slug));
    }

    public onDeleteProject(slug: string, event: MouseEvent): void {
        event.stopPropagation();
        this.openDropdownSlug.set(null);

        if (confirm('Are you sure you want to delete this project?')) {
            this.projectService.deleteProject(slug).subscribe({
                next: () => {
                    this.loadProjects();
                },
                error: (err: unknown) => {
                    console.error('Failed to delete project:', err);
                },
            });
        }
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent): void {
        if (
            this.openDropdownSlug() !== null &&
            !this.elementRef.nativeElement.contains(event.target as Node)
        ) {
            this.openDropdownSlug.set(null);
        }
    }
}
