import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Register } from './register';
import { AuthService } from '../../services/auth/auth.service';

describe('Register', () => {
	let component: Register;
	let fixture: ComponentFixture<Register>;
	let authService: { register: (payload: unknown) => ReturnType<typeof of> };

	beforeEach(async () => {
		authService = {
			register: () => of(undefined),
		};

		await TestBed.configureTestingModule({
			imports: [Register],
			providers: [{ provide: AuthService, useValue: authService }],
		}).compileComponents();

		fixture = TestBed.createComponent(Register);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show activation email message after successful register', () => {
		component.email.set('user@example.com');
		component.firstName.set('Test');
		component.lastName.set('User');
		component.username.set('tester');
		component.password.set('ValidPassword1!');
		component.confirmPassword.set('ValidPassword1!');

		component.handleSubmit();
		fixture.detectChanges();

		expect(component.registrationSuccess()).toBeTrue();
		expect(fixture.nativeElement.textContent).toContain('Activation email sent');
	});
});
