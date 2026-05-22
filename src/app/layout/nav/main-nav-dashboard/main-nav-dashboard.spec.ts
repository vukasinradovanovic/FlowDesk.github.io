import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavDashboard } from './main-nav-dashboard';

describe('MainNavDashboard', () => {
	let component: MainNavDashboard;
	let fixture: ComponentFixture<MainNavDashboard>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MainNavDashboard],
		}).compileComponents();

		fixture = TestBed.createComponent(MainNavDashboard);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
