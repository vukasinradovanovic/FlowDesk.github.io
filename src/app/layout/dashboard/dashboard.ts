import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { Footer } from "../footer/footer/footer";

@Component({
	selector: 'app-dashboard',
	imports: [RouterOutlet, Sidebar, Header, Footer],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.scss',
})
export class Dashboard {}
