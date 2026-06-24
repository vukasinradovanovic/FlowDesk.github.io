import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
	label: string;
	url: string;
}

@Component({
	selector: 'app-breadcrumbs',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './breadcrumbs.component.html',
	styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);

	public readonly breadcrumbs = signal<BreadcrumbItem[]>([]);

	constructor() {
		this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
			const root = this.activatedRoute.root;
			this.breadcrumbs.set(this.createBreadcrumbs(root));
		});
	}

	private createBreadcrumbs(
		route: ActivatedRoute,
		url: string = '',
		breadcrumbs: BreadcrumbItem[] = [],
	): BreadcrumbItem[] {
		const children: ActivatedRoute[] = route.children;

		if (children.length === 0) {
			return breadcrumbs;
		}

		let nextUrl = url;
		let activeChild: ActivatedRoute | null = null;

		// 1. Loop through all children to gather breadcrumb labels on this tier
		for (const child of children) {
			// Is this child part of our currently active route path tree?
			if (child.snapshot.url.length > 0 || child.routeConfig?.path === '') {
				activeChild = child;

				const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
				if (routeURL !== '') {
					nextUrl += `/${routeURL}`;
				}

				const label = child.snapshot.data['breadcrumb'];
				if (label) {
					const isDuplicate = breadcrumbs.some((item) => item.url === nextUrl);
					if (!isDuplicate) {
						breadcrumbs.push({ label, url: nextUrl });
					}
				}
			}
		}

		if (activeChild) {
			return this.createBreadcrumbs(activeChild, nextUrl, breadcrumbs);
		}

		return breadcrumbs;
	}
}
