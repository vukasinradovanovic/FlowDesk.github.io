import { Component, inject, computed, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ProjectService } from '../../../services/project/project';
import { PermissionService } from '../../../services/permisions/permisions';

interface NavLink {
    label: string;
    icon: string;
    route: string[];
    adons?: string;
    exact?: boolean;
    permission?: string;
}

@Component({
    selector: 'app-main-nav-dashboard',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './main-nav-dashboard.html',
    styleUrl: './main-nav-dashboard.scss',
})
export class MainNavDashboard implements OnInit {
    public readonly auth = inject(AuthService);
    private readonly projectService = inject(ProjectService);
    public readonly permissionService = inject(PermissionService);

    public readonly projectsCount = computed(() => 
        this.projectService.totalUserProjectsCount()
    );

    public canViewAllTeams = computed(() =>
        this.permissionService.hasPermission('View Teams', this.auth.currentUser()),
    );

    public readonly navLinks = computed<NavLink[]>(() => {
        const userId = this.auth.currentUser();
        if (!userId) return [];

        return [
            { label: 'Home', icon: 'bi bi-grid-1x2', route: ['/dashboard'], exact: true },
            {
                label: 'Projects',
                icon: 'bi bi-folder2-open',
                route: ['/dashboard', 'projects'],
                adons: String(this.projectsCount()),
                exact: true,
            },
            {
                label: 'Manage All Projects',
                icon: 'bi bi-folder2-open',
                route: ['/dashboard', 'projects', 'all'],
                permission: 'View Projects',
            },
            { label: 'Team', icon: 'bi bi-people', route: ['/dashboard', 'team'] },
            {
                label: 'Manage All Teams',
                icon: 'bi bi-people',
                route: ['/dashboard', 'teams', 'all'],
                permission: 'View Teams',
            },
			// { label: 'Kanban Board', icon: 'bi bi-kanban', route: ['/dashboard', 'settings'] },
			// { label: 'Calendar', icon: 'bi bi-calendar3', route: ['/dashboard', 'calendar'] },
			// { label: 'Analytics', icon: 'bi bi-bar-chart', route: ['/dashboard', 'analytics'] },
			// { label: 'Notifications', icon: 'bi bi-bell', route: ['/dashboard', 'team'], adons: '5' },
			// { label: 'Workspace', icon: 'bi bi-gear', route: ['/dashboard', 'team'] },
			// { label: 'Settings', icon: 'bi bi-question-circle', route: ['/dashboard', 'team'] },
        ];
    });

    ngOnInit(): void {
        this.projectService.getUsersProjects().subscribe();
    }
}

