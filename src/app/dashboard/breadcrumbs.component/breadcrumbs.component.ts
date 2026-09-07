import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TasksService } from '../../services/tasks/tasks.service';

export interface BreadcrumbItem {
	label: string;
	url: string;
}

interface BreadcrumbParent {
	match: string;
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
	private readonly tasksService = inject(TasksService);

	public readonly breadcrumbs = signal<BreadcrumbItem[]>([]);
	private previousUrl = '';
	private currentUrl = this.router.url;

	constructor() {
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event) => {
				this.previousUrl = this.currentUrl;
				this.currentUrl = event.urlAfterRedirects;
				this.refreshBreadcrumbs();
			});

		effect(() => {
			this.tasksService.currentTask();
			this.refreshBreadcrumbs();
		});
	}

	private refreshBreadcrumbs(): void {
		this.breadcrumbs.set(this.createBreadcrumbs(this.activatedRoute.root));
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

				const label =
					child.routeConfig?.path === 'tasks/:slug'
						? this.tasksService.currentTask()?.name ?? 'Task'
						: child.snapshot.data['breadcrumb'];
				if (label) {
					const parent = this.getBreadcrumbParent(child.snapshot.data['breadcrumbParents']);
					if (parent && !breadcrumbs.some((item) => item.url === parent.url)) {
						breadcrumbs.push(parent);
					}

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

	private getBreadcrumbParent(value: unknown): BreadcrumbItem | null {
		if (!Array.isArray(value)) return null;

		const parents = value as BreadcrumbParent[];
		const previousPath = this.previousUrl.split('?')[0];
		const parent = parents.find(
			(candidate) =>
				typeof candidate.match === 'string' && previousPath.startsWith(candidate.match),
		);

		return parent ? { label: parent.label, url: parent.url } : null;
	}
}
