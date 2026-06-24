import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, of, tap } from 'rxjs';

export interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    avatarColor?: string; // e.g. "emerald", "indigo" 
    avatarClass?: string; // Generated helper for dynamic template styling classes
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);
    
    public readonly usersData = signal<User[] | null>(null);
    public readonly currentUser = signal<User | null>(null);

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
            amber: 'bg-amber text-dark',
            rose: 'bg-rose text-white'
        };

        return {
            ...user,
            avatarClass: user.avatarColor ? (colorMaps[user.avatarColor] || 'bg-secondary text-white') : 'bg-secondary text-white'
        };
    }

    getMembersById(id: number): Observable<User | undefined> {
        if (id === -1) {
            return this.loadInitialData().pipe(map(() => undefined));
        }
        return this.loadInitialData().pipe(map((users) => users.find((u) => u.id === id)));
    }

    private loadInitialData(): Observable<User[]> {
        const currentUsers = this.usersData();
        if (currentUsers !== null) {
            return of(currentUsers);
        }
        
        return this.http.get<{users: User[]}>('/assets/data/data.json').pipe(
            map(response => (response.users || []).map(u => this.mapAvatarClass(u))),
            tap(users => this.usersData.set(users))
        );
    }

    public login(email: string, password: string): Observable<User> {
        return this.loadInitialData().pipe(
            map(users => {
                const user = users.find(u => u.email === email && u.password === password);
                if (!user) {
                    throw new Error('Pogrešan email ili lozinka.');
                }
                
                this.currentUser.set(user);
                
                if (isPlatformBrowser(this.platformId)) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
                
                return user;
            })
        );
    }

    public register(userData: User): Observable<User> {
        return this.loadInitialData().pipe(
            map(users => {
                const existingUser = users.find(u => u.email === userData.email);
                if (existingUser) {
                    throw new Error('Korisnik sa ovim email-om već postoji.');
                }
                
                const colors = ['emerald', 'indigo', 'amber', 'rose'];
                const assignedColor = userData.avatarColor || colors[Math.floor(Math.random() * colors.length)];

                const newUser = this.mapAvatarClass({
                    ...userData,
                    avatarColor: assignedColor,
                    id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1
                });
                
                const updatedUsers = [...users, newUser];
                this.usersData.set(updatedUsers);
                this.currentUser.set(newUser);
                
                if (isPlatformBrowser(this.platformId)) {
                    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
                }
                
                return newUser;
            })
        );
    }

    public logout(): void {
        this.currentUser.set(null);
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('currentUser');
        }
    }
}