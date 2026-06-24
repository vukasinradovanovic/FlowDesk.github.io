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
    avatarColor?: string | "bg-emerald" | "bg-indigo" | "bg-amber" | "bg-rose"; 
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
        // Sprečava da se informacije izbrisu prilikom osvežavanja stranice
        if (isPlatformBrowser(this.platformId)) {
            const storedUser = sessionStorage.getItem('currentUser');
            if (storedUser) {
                this.currentUser.set(JSON.parse(storedUser));
            }
        }
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
            map(response => response.users),
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
                
                // Čuvamo podatke u sesiju prilikom logina
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
                
                const newUser = {
                    ...userData,
                    id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1
                };
                
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