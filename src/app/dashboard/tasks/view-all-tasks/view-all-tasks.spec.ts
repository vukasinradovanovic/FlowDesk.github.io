import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTasks } from './view-all-tasks';

describe('ViewAllTasks', () => {
	let component: ViewAllTasks;
	let fixture: ComponentFixture<ViewAllTasks>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ViewAllTasks],
		}).compileComponents();

		fixture = TestBed.createComponent(ViewAllTasks);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
