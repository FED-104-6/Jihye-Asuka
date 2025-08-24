import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { User, UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-profile',
  imports: [DatePipe],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {
  currentUser!: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id'); 
    
    if (!userId) {
      this.authService.currentUser$.subscribe((loggedUser) => {
        if (loggedUser) {
          this.currentUser = loggedUser;
        }
      });
    } else {
      this.userService.getUserById(userId).subscribe((user) => {
        if(user) {
          this.currentUser = user;
        }
      });
    }
  }

  goToEditPage() {
    window.location.href = `/edit-profile/${this.currentUser._id}`;
  }
}
