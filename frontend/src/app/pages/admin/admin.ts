import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  constructor(private authService: AuthService) {}
  
  adminLogout() {
    alert('logout');
    this.authService.logout();
    window.location.href = '/home';
  }
}
