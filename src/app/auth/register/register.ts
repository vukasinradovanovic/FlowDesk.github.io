import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
	protected readonly theme = inject(ThemeService);
	protected readonly passwordVisible = signal(false);

	protected togglePassword(): void {
		this.passwordVisible.update((value) => !value);
	}
}
