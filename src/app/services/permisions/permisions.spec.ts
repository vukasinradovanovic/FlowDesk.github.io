import { TestBed } from '@angular/core/testing';

import { Permisions } from './permisions';

describe('Permisions', () => {
	let service: Permisions;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(Permisions);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
