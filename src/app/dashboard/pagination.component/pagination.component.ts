import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
	selector: 'app-pagination',
	imports: [],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
	@Input({ required: true }) set currentPage(value: number) {
		this._currentPage.set(value);
	}
	@Input({ required: true }) set totalPages(value: number) {
		this._totalPages.set(value);
	}
	@Input({ required: true }) set totalCount(value: number) {
		this._totalCount.set(value);
	}
	@Input() set pageSize(value: number) {
		this._pageSize.set(value);
	}

	@Output() pageChange = new EventEmitter<number>();

	protected readonly _currentPage = signal<number>(1);
	protected readonly _totalPages = signal<number>(1);
	protected readonly _totalCount = signal<number>(0);
	protected readonly _pageSize = signal<number>(10);

	protected readonly startItem = computed(() => {
		if (this._totalCount() === 0) return 0;
		return (this._currentPage() - 1) * this._pageSize() + 1;
	});

	protected readonly endItem = computed(() => {
		return Math.min(this._currentPage() * this._pageSize(), this._totalCount());
	});

	protected readonly pageNumbers = computed(() => {
		const total = this._totalPages();
		const current = this._currentPage();
		const pages: (number | string)[] = [];

		if (total <= 7) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		pages.push(1);
		if (current > 3) pages.push('...');

		const start = Math.max(2, current - 1);
		const end = Math.min(total - 1, current + 1);

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (current < total - 2) pages.push('...');
		pages.push(total);

		return pages;
	});

	protected selectPage(page: number | string): void {
		if (
			typeof page === 'number' &&
			page >= 1 &&
			page <= this._totalPages() &&
			page !== this._currentPage()
		) {
			this.pageChange.emit(page);
		}
	}
}
