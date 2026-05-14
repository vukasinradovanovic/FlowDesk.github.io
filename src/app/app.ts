import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routeFade', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          [
            style({ position: 'absolute', inset: 0 }),
          ],
          { optional: true }
        ),
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(6px)' }),
            animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-6px)' })),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class App {
  protected readonly title = signal('FlowDesk');
}
