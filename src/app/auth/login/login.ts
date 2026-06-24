import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ThemeService } from '../../services/theme/theme.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
	protected readonly theme = inject(ThemeService);
	protected readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	protected readonly passwordVisible = signal(false);
	
	protected email = signal('');
	protected password = signal('');
	protected errorMessage = signal<string | null>(null);
	protected isLoading = signal(false);

	protected togglePassword(): void {
		this.passwordVisible.update((value) => !value);
	}

	protected handleSubmit(): void {
		if (!this.email() || !this.password()) {
			this.errorMessage.set('Please enter both email and password.');
			return;
		}

		this.isLoading.set(true);
		this.errorMessage.set(null);

		this.authService.login(this.email(), this.password()).subscribe({
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
