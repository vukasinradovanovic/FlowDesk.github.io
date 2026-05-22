import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth/auth.service';
import { Project, ProjectService } from '../../../services/project/project';

@Component({
	selector: 'app-index',
	imports: [DatePipe, CommonModule],
	templateUrl: './index.html',
	styleUrl: './index.scss',
})
export class Index implements OnInit {
	protected readonly Date = Date;
	private readonly projects = inject(ProjectService);

	auth = inject(AuthService);
	userProjects: Project[] = [];

	ngOnInit(): void {
		if (this.auth.usersData === null) {
			this.auth.getMembersById(-1).subscribe();
		}

		this.projects.getProjects().subscribe({
			next: (data: Project[]) => {
				this.userProjects = data;
			},
			error: (err) => {
				console.error('Failed to load user projects:', err);
			},
		});
	}

	getMemberDetails(id: number): User | undefined {
		return this.auth.usersData?.find(user => user.id === id);
	}
}
