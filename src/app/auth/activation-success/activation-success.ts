import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-activation-success',
  imports: [RouterLink],
  templateUrl: './activation-success.html',
  styleUrl: './activation-success.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivationSuccess {
  protected readonly route = inject(ActivatedRoute);
  protected readonly activationToken = this.route.snapshot.queryParamMap.get('token');
  protected readonly isTokenPresent = !!this.activationToken && this.activationToken.trim().length > 0;
}
