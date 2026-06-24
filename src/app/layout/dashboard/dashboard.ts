import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { Footer } from '../footer/footer/footer';
import { ProjectService } from '../../services/project/project';
import { AuthService } from '../../services/auth/auth.service';
import { TeamService } from '../../services/team/team.service';

@Component({
	selector: 'app-dashboard',
	imports: [RouterOutlet, Sidebar, Header, Footer],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.scss',
})
export class Dashboard {
	projectService = inject(ProjectService);
	authService = inject(AuthService);
	teamService = inject(TeamService);

	projectsTrigger = toSignal(this.projectService.getProjects(), { initialValue: null });

	authTrigger = toSignal(this.authService.getMembersById(-1), { initialValue: null });
}
