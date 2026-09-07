import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponnent } from './task-form.componnent';

describe('TaskFormComponnent', () => {
	let component: TaskFormComponnent;
	let fixture: ComponentFixture<TaskFormComponnent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TaskFormComponnent],
		}).compileComponents();

		fixture = TestBed.createComponent(TaskFormComponnent);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
