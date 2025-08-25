import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})

export class MyProfile {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  birthDate = "";

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.firstName = currentUser.firstname;
      this.lastName = currentUser.lastname;
      this.email = currentUser.email;
      this.birthDate =  new Date(currentUser.birthdate).toISOString().split('T')[0];
    }
  }

  goToEditPage() {
    this.router.navigate(['/edit-profile'])
  }
}
