import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/auth/auth.service';
import { ProjectService } from '../../../services/project/project';

interface NavLink {
  label: string;
  icon: string;
  route: string[];
  adons?: string;
  exact?: boolean;
}

@Component({
    selector: 'app-main-nav-dashboard',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './main-nav-dashboard.html',
    styleUrl: './main-nav-dashboard.scss',
})
export class MainNavDashboard {
    public readonly auth = inject(AuthService);
    private readonly projectService = inject(ProjectService);
    
    private readonly projects = toSignal(this.projectService.getProjects(), { initialValue: [] });

    public readonly projectsCount = computed(() => this.projects().length);

    public readonly navLinks = computed<NavLink[]>(() => {
        const userId = this.auth.currentUser()?.id;
        if (!userId) return [];

        return [
            { label: 'Home', icon: 'bi bi-grid-1x2', route: ['/dashboard'], exact: true },
            { label: 'Projects', icon: 'bi bi-folder2-open', route: ['/dashboard', 'projects'], adons: this.projectsCount().toString() },
            { label: 'Team', icon: 'bi bi-people', route: ['/dashboard', 'team'] },
            // { label: 'Kanban Board', icon: 'bi bi-kanban', route: ['/dashboard', 'settings'] },
			// { label: 'Calendar', icon: 'bi bi-calendar3', route: ['/dashboard', 'calendar'] },
			// { label: 'Analytics', icon: 'bi bi-bar-chart', route: ['/dashboard', 'analytics'] },
			// { label: 'Notifications', icon: 'bi bi-bell', route: ['/dashboard', 'team'], adons: '5' },
			// { label: 'Workspace', icon: 'bi bi-gear', route: ['/dashboard', 'team'] },
			// { label: 'Settings', icon: 'bi bi-question-circle', route: ['/dashboard', 'team'] },
        ];
    });
}

