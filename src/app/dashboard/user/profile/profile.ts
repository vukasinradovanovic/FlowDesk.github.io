import { Component, inject, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { RoleService } from '../../../services/role/role.service';
import { PermissionService } from '../../../services/permisions/permisions';
import { NgClass } from '@angular/common';
import { AvatarComponent } from '../../avatar.component/avatar.component';

@Component({
    selector: 'app-profile',
    standalone: true,
	imports: [NgClass, AvatarComponent],
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
})
export class Profile {
    public readonly auth = inject(AuthService);
    private readonly roleService = inject(RoleService);
    private readonly permissionService = inject(PermissionService);

    // Track the active user context id cleanly
    private currentUserId = computed(() => this.auth.currentUser()?.id);

    // Resolve the textual name of their active role assignment
    public userRoleName = toSignal(
        toObservable(this.currentUserId).pipe(
            switchMap((uid) => (uid ? this.roleService.getUserRoleName(uid) : of('Guest')))
        ),
        { initialValue: 'Loading Role...' }
    );

    // Resolve the clean list array of unique permission tag strings
    public userPermissions = toSignal(
        toObservable(this.currentUserId).pipe(
            switchMap((uid) => (uid ? this.permissionService.getUserPermissions(uid) : of([])))
        ),
        { initialValue: [] }
    );
}