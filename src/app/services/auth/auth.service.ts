import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { Role } from '../role/role.service';

export interface PermissionResponse {
	name: string;
}

export interface User {
	id: number;
	firstName?: string;
	lastName?: string;
	email?: string;
	avatarColor?: string;
	avatarClass?: string;
	role: Role;
	permissions?: PermissionResponse[] | string[];
}

export interface LoginResponse {
	token: string;
	refreshToken: string;
	user?: User;
}

export interface RegisterRequest {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	avatarColor?: string;
	username?: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly http = inject(HttpClient);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	private readonly loginApiUrl = 'https://localhost:7175/api/auth/login';
	private readonly registerApiUrl = 'https://localhost:7175/api/register';
	private readonly logoutApiUrl = 'https://localhost:7175/api/auth/logout';

	public readonly usersData = signal<User[] | null>(null);
	public readonly currentUser = signal<User | null>(this.getStoredUser());

	private mapAvatarClass(user: User): User {
		const colorMaps: Record<string, string> = {
			emerald: 'bg-emerald text-white',
			indigo: 'bg-indigo text-white',
			amber: 'bg-amber text-white',
			rose: 'bg-rose text-white',
		};

		return {
			...user,
			avatarClass: user.avatarColor
				? colorMaps[user.avatarColor] || 'bg-secondary text-white'
				: 'bg-secondary text-white',
		};
	}

	private getStoredUser(): User | null {
		if (this.isBrowser) {
			const stored = sessionStorage.getItem('currentUser');
			if (stored) {
				try {
					const parsedUser: User = JSON.parse(stored);
					return this.mapAvatarClass(parsedUser);
				} catch {
					return null;
				}
			}
		}
		return null;
	}

	public getToken(): string | null {
		if (this.isBrowser) {
			return localStorage.getItem('accessToken');
		}
		return null;
	}

	public login(email: string, password: string): Observable<LoginResponse> {
		return this.http
			.post<LoginResponse>(this.loginApiUrl, { email, password })
			.pipe(tap((response) => this.handleAuthSuccess(response)));
	}

	public register(requestData: RegisterRequest): Observable<LoginResponse> {
		return this.http
			.post<LoginResponse>(this.registerApiUrl, requestData)
			.pipe(tap((response) => this.handleAuthSuccess(response)));
	}

	private handleAuthSuccess(response: LoginResponse): void {
		if (this.isBrowser) {
			if (response.token) {
				localStorage.setItem('accessToken', response.token);
			}
			if (response.refreshToken) {
				localStorage.setItem('refreshToken', response.refreshToken);
			}

			if (response.user) {
				const formattedUser = this.mapAvatarClass(response.user);
				sessionStorage.setItem('currentUser', JSON.stringify(formattedUser));
				this.currentUser.set(formattedUser);
			}
		}
	}

	public logout(): Observable<void> {
		return this.http.post<void>(this.logoutApiUrl, {}).pipe(
			tap({
				next: () => this.clearLocalSession(),
				error: (err) => {
					console.error('Logout failed on server, cleaning local session anyway', err);
					this.clearLocalSession();
				},
			}),
		);
	}

	private clearLocalSession(): void {
		if (this.isBrowser) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('currentUser');
			this.currentUser.set(null);
		}
	}
}
