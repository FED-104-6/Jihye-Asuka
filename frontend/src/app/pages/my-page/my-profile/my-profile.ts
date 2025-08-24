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
  whatAdminCanOnlySee: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.whatAdminCanOnlySee = this.route.snapshot.paramMap.get('id');

    if (!this.whatAdminCanOnlySee) {
      this.authService.currentUser$.subscribe((loggedUser) => {
        if (loggedUser) {
          this.currentUser = loggedUser;
        }
      });
    } else {
      this.userService
        .getUserById(this.whatAdminCanOnlySee)
        .subscribe((user) => {
          if (user) {
            this.currentUser = user;
          }
        });
    }
  }

  goToEditPage() {
    if (!this.whatAdminCanOnlySee) {
      window.location.href = '/user/edit';
    } else {
      window.location.href = `/admin/edit/${this.currentUser._id}`;
    }
  }
}
