import { Component, computed, EventEmitter, input, Input, output, Output, signal } from '@angular/core';

@Component({
	selector: 'app-pagination',
	imports: [],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
	public readonly currentPage = input.required<number>();
    public readonly totalPages = input.required<number>();
    public readonly totalCount = input.required<number>();
    public readonly pageSize = input<number>(10);

    public readonly pageChange = output<number>();

    protected readonly startItem = computed(() => {
        if (this.totalCount() === 0) return 0;
        return (this.currentPage() - 1) * this.pageSize() + 1;
    });

    protected readonly endItem = computed(() => {
        return Math.min(this.currentPage() * this.pageSize(), this.totalCount());
    });

    // Page Numbers Generator
    protected readonly pageNumbers = computed(() => {
        const total = this.totalPages();
        const current = this.currentPage();
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
            page <= this.totalPages() &&
            page !== this.currentPage()
        ) {
            this.pageChange.emit(page);
        }
    }
}
