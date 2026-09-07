import { TestBed } from '@angular/core/testing';

import { Pagination } from './pagination';

describe('Pagination', () => {
	let service: Pagination;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(Pagination);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should send searchTerm as the backend keyword parameter', () => {
		const params = service.buildHttpParams({ searchTerm: 'release notes' });

		expect(params.get('keyword')).toBe('release notes');
		expect(params.has('searchTerm')).toBeFalsy();
	});
});
