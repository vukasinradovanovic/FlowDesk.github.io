import { DestroyRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-search',
	imports: [],
	templateUrl: './search.component.html',
	styleUrl: './search.component.scss',
})
export class SearchComponent {
	public readonly placeholder = input('Search');
	public readonly label = input('Search');
	public readonly initialValue = input('');
	public readonly searchChange = output<string>();
	public readonly value = signal('');

	private readonly destroyRef = inject(DestroyRef);
	private readonly searchTerms = new Subject<string>();

	constructor() {
		effect(() => {
			const initialValue = this.initialValue();
			if (initialValue !== this.value()) {
				this.value.set(initialValue);
			}
		});

		this.searchTerms
			.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
			.subscribe((term) => this.searchChange.emit(term));
	}

	public onInput(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.value.set(value);
		this.searchTerms.next(value);
	}
}
