import { Component } from '@angular/core';
import { MainNavDashboard } from '../nav/main-nav-dashboard/main-nav-dashboard';

@Component({
	selector: 'app-sidebar',
	imports: [MainNavDashboard],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.scss',
})
export class Sidebar {}
