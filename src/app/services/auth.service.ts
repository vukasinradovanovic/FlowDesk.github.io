import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, delay, map, of, tap } from 'rxjs';

export interface User {
	id?: number;
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly http = inject(HttpClient);
	private readonly platformId = inject(PLATFORM_ID);
	
	private usersData: User[] | null = null;
	public currentUser: User | null = null;

	constructor() {
		if (isPlatformBrowser(this.platformId)) {
			const storedUser = sessionStorage.getItem('currentUser');
			if (storedUser) {
				this.currentUser = JSON.parse(storedUser);
			}
		}
	}

	private loadInitialData(): Observable<User[]> {
		if (this.usersData !== null) {
			return of(this.usersData);
		}
		
		return this.http.get<{users: User[]}>('/assets/data/data.json').pipe(
			map(response => response.users),
			tap(users => this.usersData = users)
		);
	}

	public login(email: string, password: string): Observable<User> {
		return this.loadInitialData().pipe(
			map(users => {
				const user = users.find(u => u.email === email && u.password === password);
				if (!user) {
					throw new Error('Pogrešan email ili lozinka.');
				}
				this.currentUser = user;
				
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
				
				users.push(newUser);
				
				this.currentUser = newUser;
				
				if (isPlatformBrowser(this.platformId)) {
					sessionStorage.setItem('currentUser', JSON.stringify(newUser));
				}
				
				return newUser;
			})
		);
	}

    public logout(): void {
        this.currentUser = null;
        
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('currentUser');
        }
    }
}
