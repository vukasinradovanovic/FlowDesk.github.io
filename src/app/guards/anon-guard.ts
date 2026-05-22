import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const anonGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformBrowser(platformId)) {
		const userSession = sessionStorage.getItem('currentUser');
		if (userSession) {
			router.navigate(['/dashboard']);
			return false;
		}
		return true;
	}
	return true;
};
