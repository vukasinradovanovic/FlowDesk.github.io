import { Component, inject, OnInit, signal } from '@angular/core';
import {
	TeamFormComponent,
	TeamFormData,
} from '../../forms/team-form.component/team-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../../services/team/team.service';

@Component({
	selector: 'app-edit-team',
	imports: [TeamFormComponent],
	templateUrl: './edit-team.html',
	styleUrl: './edit-team.scss',
})
export class EditTeam implements OnInit {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly teamService = inject(TeamService);

	public teamId = signal<number | null>(null);
	public initialTeamData = signal<TeamFormData | null>(null);

	ngOnInit(): void {
		const idParam = this.route.snapshot.paramMap.get('id');

		if (idParam !== null && !isNaN(Number(idParam))) {
			const id = Number(idParam);
			this.teamId.set(id);

			this.teamService.getTeamById(id).subscribe({
				next: (team: TeamFormData) => this.initialTeamData.set(team),
				error: (err: unknown) => console.error('Failed to load team data', err),
			});
		}
	}

	public handleUpdate(payload: TeamFormData): void {
		const id = this.teamId();
		if (id === null) return;

		this.teamService.updateTeam(id, payload).subscribe({
			next: () => {
				this.router.navigate(['/dashboard/team']);
			},
			error: (err: unknown) => console.error('Failed to update team', err),
		});
	}
}
