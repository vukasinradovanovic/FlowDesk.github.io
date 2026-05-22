import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private readonly storageKey = 'fd-theme';
	private readonly doc = inject(DOCUMENT);

	readonly theme = signal<Theme>(this.loadTheme());
	readonly iconClass = computed(() =>
		this.theme() === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars'
	);

	constructor() {
		effect(() => {
			const theme = this.theme();
			this.doc.documentElement.setAttribute('data-bs-theme', theme);
			this.saveTheme(theme);
		});
	}

	toggleTheme(): void {
		this.theme.update((value) => (value === 'dark' ? 'light' : 'dark'));
	}

	private loadTheme(): Theme {
		try {
			const stored = globalThis.localStorage?.getItem(this.storageKey);
			return stored === 'dark' ? 'dark' : 'light';
		} catch {
			return 'light';
		}
	}

	private saveTheme(theme: Theme): void {
		try {
			globalThis.localStorage?.setItem(this.storageKey, theme);
		} catch {
			// Ignore storage failures (e.g. disabled storage).
		}
	}
}
