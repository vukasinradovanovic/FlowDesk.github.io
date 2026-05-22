import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const userSession = sessionStorage.getItem('userSession');

	if (!userSession) {
		router.navigate(['/']);
		return false;
	}
	
	return true;
};
