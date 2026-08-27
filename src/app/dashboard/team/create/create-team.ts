import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
	TeamFormComponent,
	TeamFormData,
} from '../../forms/team-form.component/team-form.component';
import { TeamService } from '../../../services/team/team.service';

@Component({
	selector: 'app-create-team',
	standalone: true,
	imports: [TeamFormComponent],
	templateUrl: './create-team.html',
	styleUrl: './create-team.scss',
})
export class CreateTeam {
	private readonly router = inject(Router);
	private readonly teamService = inject(TeamService);

	public handleCreate(payload: TeamFormData): void {
		this.teamService.createTeam(payload).subscribe({
			next: (response) => {
				console.log('Team created successfully:', response);
				this.router.navigate(['/dashboard/team']);
			},
			error: (err) => {
				console.error('Failed to create team:', err);
			},
		});
	}
}
