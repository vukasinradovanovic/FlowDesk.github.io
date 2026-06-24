import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../services/auth/auth.service';

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
    @Input() user: User | null | undefined = null;

    @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

    protected initials = computed(() => {
        const u = this.user;
        if (!u || !u.firstName) return '?';
        
        const firstInitial = u.firstName.charAt(0);
        const lastInitial = u.lastName ? u.lastName.charAt(0) : '';
        
        return (firstInitial + lastInitial).toUpperCase();
    });

    protected avatarClass = computed(() => {
        return this.user?.avatarClass || 'bg-secondary text-white';
    });

    protected sizeInitials = computed(() => {
        return `avatar-initials--${this.size}`;
    });


    protected sizeClass = computed(() => {
        return `avatar-${this.size}`;
    });
}