import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	computed,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../pagination.component/pagination.component';
import { AuthService } from '../../../services/auth/auth.service';
import { PermissionService } from '../../../services/permisions/permisions';
import { Task, TasksService } from '../../../services/tasks/tasks.service';
import { SearchComponent } from '../../search.component/search.component/search.component';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-view-all-tasks',
	imports: [CommonModule, DatePipe, FormsModule, PaginationComponent, SearchComponent, RouterLink],
	templateUrl: './view-all-tasks.html',
	styleUrl: './view-all-tasks.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'(document:click)': 'onClickOutside($event)',
	},
})
export class ViewAllTasks implements OnInit {
	protected readonly currentDate = new Date();

	private readonly tasksService = inject(TasksService);
	private readonly permissionService = inject(PermissionService);
	private readonly auth = inject(AuthService);
	private readonly elementRef = inject(ElementRef);

	public readonly currentPage = signal(1);
	public readonly pageSize = signal(10);
	public readonly searchTerm = signal('');
	public readonly openDropdownSlug = signal<string | null>(null);

	public readonly paginatedTasks = computed(() => this.tasksService.allTasksState());
	public readonly tasks = computed<Task[]>(() => this.paginatedTasks()?.items ?? []);
	public readonly totalPages = computed(() => this.paginatedTasks()?.pagesCount ?? 1);
	public readonly totalCount = computed(() => this.paginatedTasks()?.totalCount ?? 0);

	// Permissions
	public readonly canCreateTask = computed(() =>
		this.permissionService.hasPermission('Create Tasks', this.auth.currentUser()),
	);
	public readonly canEditTask = computed(() =>
		this.permissionService.hasPermission('Edit Tasks', this.auth.currentUser()),
	);
	public readonly canDeleteTask = computed(() =>
		this.permissionService.hasPermission('Delete Tasks', this.auth.currentUser()),
	);

	ngOnInit(): void {
		this.loadTasks();
	}

	public loadTasks(): void {
		this.tasksService
			.getAllTasks({
				currentPage: this.currentPage(),
				perPage: this.pageSize(),
				searchTerm: this.searchTerm(),
			})
			.subscribe();
	}

	public goToPage(page: number): void {
		this.currentPage.set(page);
		this.loadTasks();
	}

	public onSearchChange(term: string): void {
		this.searchTerm.set(term);
		this.currentPage.set(1);
		this.loadTasks();
	}

	public descriptionPreview(description: string): string {
		const preview = description ?? '';
		return preview.length > 20 ? `${preview.slice(0, 20)}...` : preview;
	}

	public toggleDropdownTask(slug: string, event: MouseEvent): void {
		event.stopPropagation();
		this.openDropdownSlug.update((current) => (current === slug ? null : slug));
	}

	public onDeleteTask(slug: string, event: MouseEvent): void {
		event.stopPropagation();
		this.openDropdownSlug.set(null);

		if (confirm('Are you sure you want to delete this task?')) {
			this.tasksService.deleteTask(slug).subscribe({
				next: () => this.loadTasks(),
				error: (error: unknown) => console.error('Failed to delete task:', error),
			});
		}
	}

	public onClickOutside(event: MouseEvent): void {
		if (
			this.openDropdownSlug() !== null &&
			!this.elementRef.nativeElement.contains(event.target as Node)
		) {
			this.openDropdownSlug.set(null);
		}
	}
}
