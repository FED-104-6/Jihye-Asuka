import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/user.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  currentUser$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  adminLogout() {
    alert('logout');
    this.authService.logout();
    window.location.href = '/home';
  }
}
