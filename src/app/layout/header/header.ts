import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ThemeService } from '../../services/theme/theme.service';
import { Router, RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../../dashboard/breadcrumbs.component/breadcrumbs.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, BreadcrumbsComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly theme = inject(ThemeService);
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
