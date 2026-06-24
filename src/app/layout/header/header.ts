import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ThemeService } from '../../services/theme/theme.service';
import { Router, RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../../dashboard/breadcrumbs.component/breadcrumbs.component';
import { AvatarComponent } from '../../dashboard/avatar.component/avatar.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, BreadcrumbsComponent, AvatarComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly theme = inject(ThemeService);
  auth = inject(AuthService);
  router = inject(Router);
  private elementRef = inject(ElementRef);

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectedOption() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  protected handleLogout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}