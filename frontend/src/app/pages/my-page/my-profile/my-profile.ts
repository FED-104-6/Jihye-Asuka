import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { User, UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-my-profile',
  imports: [DatePipe, CommonModule, RouterModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {
  currentUser$!: Observable<User>;
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
      this.currentUser$ = this.authService.currentUser$.pipe(
        filter((user): user is User => user != null)
      );
    } else {
      this.currentUser$ = this.userService.getUserById(
        this.whatAdminCanOnlySee
      );
    }
  }

  goToEditPage(userId: string) {
    if (!this.whatAdminCanOnlySee) {
      this.router.navigate(['/user/edit']);
    } else {
      this.router.navigate([`/admin/edit/${userId}`]);
    }
  }
}
