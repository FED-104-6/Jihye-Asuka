import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMenuOpen = false;
  currentUser$!: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    if (!confirm('Are you sure you want to logout your account?')) return;
    alert('successfully logged out.');
    this.authService.logout();
    window.location.href = '/home';
  }

  deleteUser() {
    if (!confirm('Are you sure you want to delete your account?')) return;

    this.currentUser$.subscribe((user) => {
      if (user?._id) {
        this.userService.deleteUser(user._id).subscribe({
          next: () => {
            alert('Account successfully deleted.');
            this.authService.logout();
            window.location.href = '/home';
          },
          error: (err) => {
            console.error('Error deleting account:', err);
            alert('Failed to delete account.');
          },
        });
      }
    });
  }
}
