import { Component, inject } from '@angular/core';
import { ProjectService } from '../../../services/project/project';
import { TeamService } from '../../../services/team/team.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
	selector: 'app-edit',
	imports: [CommonModule, DatePipe],
	templateUrl: './edit.html',
	styleUrl: './edit.scss',
})
export class Edit {
	protected readonly Date = Date;
    
    private readonly projectService = inject(ProjectService);
    private readonly teamService = inject(TeamService);
    public readonly auth = inject(AuthService);
}
