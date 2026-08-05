import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, of, tap } from 'rxjs';

export interface LoginResponse {
	tokenId: string;
	refreshToken: string;
	user?: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarColor?: string;
}

export interface User {
	firstName?: string;
	lastName?: string;
	email?: string;
	avatarColor?: string;
	avatarClass?: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly http = inject(HttpClient);
	private readonly platformId = inject(PLATFORM_ID);

	public readonly usersData = signal<User[] | null>(null);
	currentUser = signal<any | null>(this.getStoredUser());

	private loginApiUrl = 'https://localhost:7175/api/auth/login';
    private registerApiUrl = 'https://localhost:7175/api/auth/register';

	constructor() {
		if (isPlatformBrowser(this.platformId)) {
			const storedUser = sessionStorage.getItem('currentUser');
			if (storedUser) {
				this.currentUser.set(JSON.parse(storedUser));
			}
		}
	}

	// Helper map method to append custom CSS utilities cleanly based on color keys
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

	// Get the currently logged-in user as an observable
	private getStoredUser(): User | null {
		if (isPlatformBrowser(this.platformId)) {
			const stored = sessionStorage.getItem('currentUser');
			if (stored) {
				const parsedUser: User = JSON.parse(stored);
				return this.mapAvatarClass(parsedUser); // 👈 Formats class on refresh
			}
		}
		return null;
	}

	public getToken(): string | null {
		if (isPlatformBrowser(this.platformId)) {
			return localStorage.getItem('accessToken');
		}
		return null;
	}

	public login(email: string, password: string): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(this.loginApiUrl, { email, password }).pipe(
			tap((response) => {
				if (isPlatformBrowser(this.platformId)) {
					localStorage.setItem('accessToken', response.tokenId);
					localStorage.setItem('refreshToken', response.refreshToken);

					if (response.user) {
						const formattedUser = this.mapAvatarClass(response.user);
						sessionStorage.setItem('currentUser', JSON.stringify(formattedUser));
						this.currentUser.set(formattedUser);
					}
				}
			}),
		);
	}

	public register(requestData: RegisterRequest): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(this.registerApiUrl, requestData).pipe(
			tap((response) => {
				if (isPlatformBrowser(this.platformId)) {
					localStorage.setItem('accessToken', response.tokenId);
					localStorage.setItem('refreshToken', response.refreshToken);

					if (response.user) {
						const formattedUser = this.mapAvatarClass(response.user);
						sessionStorage.setItem('currentUser', JSON.stringify(formattedUser));
						this.currentUser.set(formattedUser);
					}
				}
			}),
		);
	}

	public logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('currentUser');
			this.currentUser.set(null);
		}
	}
}
