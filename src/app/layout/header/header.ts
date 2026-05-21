import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  auth = inject(AuthService);
  router = inject(Router);

  isDropdownOpen = false;
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  selectedOption() {
    this.isDropdownOpen = false;
  }

  protected handleLogout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
