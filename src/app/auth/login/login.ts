import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
	protected readonly theme = inject(ThemeService);
	protected readonly passwordVisible = signal(false);

	protected togglePassword(): void {
		this.passwordVisible.update((value) => !value);
	}
}
