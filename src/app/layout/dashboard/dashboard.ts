import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { Footer } from "../footer/footer/footer";
import { ProjectService } from '../../services/project/project';
import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-dashboard',
	imports: [RouterOutlet, Sidebar, Header, Footer],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
	project = inject(ProjectService);
	auth = inject(AuthService);

	ngOnInit(): void {
		this.project.getProjects().subscribe();
		
		if (this.auth.usersData === null) {
			this.auth.getMembersById(-1).subscribe();
		}
	}
}
