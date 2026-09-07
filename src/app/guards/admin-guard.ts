import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
	const router = inject(Router);
	const platformId = inject(PLATFORM_ID);

	if (!isPlatformBrowser(platformId)) return false;

	const storedUser = sessionStorage.getItem('currentUser');
	if (!storedUser) {
		router.navigate(['/']);
		return false;
	}

	try {
		const user = JSON.parse(storedUser) as { role?: { name?: string } };
		if (user.role?.name?.toLowerCase() === 'admin') return true;
	} catch {
		// Invalid session data is treated as unauthorized.
	}

	router.navigate(['/dashboard']);
	return false;
};