import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllProjects } from './view-all-projects';

describe('ViewAllProjects', () => {
	let component: ViewAllProjects;
	let fixture: ComponentFixture<ViewAllProjects>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ViewAllProjects],
		}).compileComponents();

		fixture = TestBed.createComponent(ViewAllProjects);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
