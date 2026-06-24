import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ThemeService } from '../../services/theme/theme.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
	protected readonly theme = inject(ThemeService);
	protected readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	protected readonly passwordVisible = signal(false);

	// Stanje forme
	protected firstName = signal('');
	protected lastName = signal('');
	protected email = signal('');
	protected password = signal('');
	protected confirmPassword = signal('');
	
	protected errorMessage = signal<string | null>(null);
	protected isLoading = signal(false);

	protected togglePassword(): void {
		this.passwordVisible.update((value) => !value);
	}

	protected handleSubmit(): void {
		if (!this.firstName() || !this.lastName() || !this.email() || !this.password() || !this.confirmPassword()) {
			this.errorMessage.set('Please fill in all required fields.');
			return;
		}

		if (this.password() !== this.confirmPassword()) {
			this.errorMessage.set('Password and confirm password do not match.');
			return;
		}

		this.isLoading.set(true);
		this.errorMessage.set(null);

		this.authService.register({
			firstName: this.firstName(),
			lastName: this.lastName(),
			email: this.email(),
			password: this.password()
		}).subscribe({
			next: () => {
				this.isLoading.set(false);
				this.router.navigate(['/dashboard']);
			},
			error: (err) => {
				this.isLoading.set(false);
				this.errorMessage.set(err.message);
			}
		});
	}
}
