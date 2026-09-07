import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const activationGuard: CanActivateFn = (route) => {
	const router = inject(Router);
	const token = route.queryParamMap.get('token');

	if (token && token.trim().length > 0) {
		return true;
	}

	router.navigate(['/']);
	return false;
};
