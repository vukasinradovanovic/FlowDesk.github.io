import { Injectable } from '@angular/core';

export interface PaginatedResponse<T> {
    items: T[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

export interface PaginationParams {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

@Injectable({
	providedIn: 'root',
})
export class Pagination {
	public readonly defaultParams: PaginationParams = {
        pageNumber: 1,
        pageSize: 10,
        searchTerm: '',
    };

	public buildHttpParams(params: Partial<PaginationParams>): Record<string, string> {
        const queryParams: Record<string, string> = {
            pageNumber: (params.pageNumber ?? this.defaultParams.pageNumber).toString(),
            pageSize: (params.pageSize ?? this.defaultParams.pageSize).toString(),
        };

        if (params.searchTerm) {
            queryParams['searchTerm'] = params.searchTerm;
        }

        if (params.sortBy) {
            queryParams['sortBy'] = params.sortBy;
            queryParams['sortOrder'] = params.sortOrder ?? 'asc';
        }

        return queryParams;
    }
}
