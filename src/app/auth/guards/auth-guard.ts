import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const userSession = sessionStorage.getItem('currentUser');

	if (!userSession) {
		router.navigate(['/']);
		return false;
	}
	
	return true;
};
