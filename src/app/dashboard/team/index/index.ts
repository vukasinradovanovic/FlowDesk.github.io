import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { TeamService } from '../../../services/team/team.service';
import { AuthService, User } from '../../../services/auth/auth.service';

@Component({
    selector: 'app-index',
    imports: [CommonModule],
    templateUrl: './index.html',
    styleUrl: './index.scss',
})
export class Index {
    private readonly teamService = inject(TeamService);
    public readonly auth = inject(AuthService);

    public readonly teams = toSignal(this.teamService.getMyTeams(), { initialValue: [] });

    protected readonly authTrigger = toSignal(this.auth.getMembersById(-1), { initialValue: undefined });

    getMemberDetails(id: number): User | undefined {
    const users = this.auth.usersData() || [];
    return users.find(user => user.id === id);
}
}