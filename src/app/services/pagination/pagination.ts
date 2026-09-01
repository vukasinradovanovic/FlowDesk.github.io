import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

export interface PaginatedResponse<T> {
	totalCount: number;
	pagesCount: number;
	items: T[];
	currentPage: number;
	perPage: number;
}

export interface PaginationParams {
	currentPage?: number;
	perPage?: number;
	searchTerm?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

@Injectable({
	providedIn: 'root',
})
export class Pagination {
	public readonly defaultParams: Required<
		Pick<PaginationParams, 'currentPage' | 'perPage' | 'searchTerm'>
	> = {
		currentPage: 1,
		perPage: 10,
		searchTerm: '',
	};

	public buildHttpParams(params?: Partial<PaginationParams>): HttpParams {
		let httpParams = new HttpParams()
			.set('currentPage', (params?.currentPage ?? this.defaultParams.currentPage).toString())
			.set('perPage', (params?.perPage ?? this.defaultParams.perPage).toString());

		if (params?.searchTerm?.trim()) {
			httpParams = httpParams.set('searchTerm', params.searchTerm.trim());
		}

		if (params?.sortBy) {
			httpParams = httpParams.set('sortBy', params.sortBy);
			httpParams = httpParams.set('sortOrder', params.sortOrder ?? 'asc');
		}

		return httpParams;
	}
}
