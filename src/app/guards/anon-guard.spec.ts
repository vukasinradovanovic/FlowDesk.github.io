import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { anonGuard } from './anon-guard';

describe('anonGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => anonGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
