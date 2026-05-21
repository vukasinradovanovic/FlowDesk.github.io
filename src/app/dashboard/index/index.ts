import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-index',
	imports: [DatePipe],
	templateUrl: './index.html',
	styleUrl: './index.scss',
})
export class Index {
	protected readonly Date = Date;
	auth = inject(AuthService);
	
}
