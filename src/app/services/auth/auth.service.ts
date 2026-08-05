import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, of, tap } from 'rxjs';

export interface LoginResponse {
	tokenId: string;
	refreshToken: string;
	user?: User;
}

export interface User {
	firstName?: string;
	lastName?: string;
	email?: string;
	avatarColor?: string;
    avatarClass?: string; 
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);
    
    public readonly usersData = signal<User[] | null>(null);
    currentUser = signal<any | null>(this.getStoredUser());

    private loginApiUrl = 'https://localhost:7175/api/auth/login';

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const storedUser = sessionStorage.getItem('currentUser');
            if (storedUser) {
                this.currentUser.set(JSON.parse(storedUser));
            }
        }
    }

    // Get the currently logged-in user as an observable
    private getStoredUser() {
		if (isPlatformBrowser(this.platformId)) {
			const stored = sessionStorage.getItem('currentUser');
			return stored ? JSON.parse(stored) : null;
		}
		return null;
	}

    // Helper map method to append custom CSS utilities cleanly based on color keys
    private mapAvatarClass(user: User): User {
        const colorMaps: Record<string, string> = {
            emerald: 'bg-emerald text-white',
            indigo: 'bg-indigo text-white',
            amber: 'bg-amber text-white',
            rose: 'bg-rose text-white'
        };

        return {
            ...user,
            avatarClass: user.avatarColor ? (colorMaps[user.avatarColor] || 'bg-secondary text-white') : 'bg-secondary text-white'
        };
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
						sessionStorage.setItem('currentUser', JSON.stringify(response.user));
						this.currentUser.set(response.user);
					}
				}
			}),
		);
	}

    // public register(userData: User): Observable<User> {
    //     return this.loadInitialData().pipe(
    //         map(users => {
    //             const existingUser = users.find(u => u.email === userData.email);
    //             if (existingUser) {
    //                 throw new Error('Korisnik sa ovim email-om već postoji.');
    //             }
                
    //             const colors = ['emerald', 'indigo', 'amber', 'rose'];
    //             const assignedColor = userData.avatarColor || colors[Math.floor(Math.random() * colors.length)];

    //             const newUser = this.mapAvatarClass({
    //                 ...userData,
    //                 avatarColor: assignedColor,
    //                 id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1
    //             });
                
    //             const updatedUsers = [...users, newUser];
    //             this.usersData.set(updatedUsers);
    //             this.currentUser.set(newUser);
                
    //             if (isPlatformBrowser(this.platformId)) {
    //                 sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    //             }
                
    //             return newUser;
    //         })
    //     );
    // }

    public logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('currentUser');
			this.currentUser.set(null);
		}
	}
}