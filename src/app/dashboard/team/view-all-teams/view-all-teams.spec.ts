import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTeams } from './view-all-teams';

describe('ViewAllTeams', () => {
	let component: ViewAllTeams;
	let fixture: ComponentFixture<ViewAllTeams>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ViewAllTeams],
		}).compileComponents();

		fixture = TestBed.createComponent(ViewAllTeams);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
