import { Component } from '@angular/core';
// <<<<<<< HEAD
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../../services/auth.service';

// @Component({
//   selector: 'app-my-profile',
//   imports: [CommonModule],
// =======
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { User, UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-my-profile',
  imports: [DatePipe, CommonModule, RouterModule],
// >>>>>>> dfcd12356210f6d6f13b19515aee762d49cbff54
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {
// <<<<<<< HEAD
//   firstName: string = "";
//   lastName: string = "";
//   email: string = "";
//   birthDate = "";

//   constructor(
//     private router: Router,
//     private authService: AuthService
//   ) { }

//   ngOnInit() {
//     const currentUser = this.authService.getUser();
    
//     if (currentUser) {
//       this.firstName = currentUser.firstname;
//       this.lastName = currentUser.lastname;
//       this.email = currentUser.email;
//       this.birthDate =  new Date(currentUser.birthdate).toISOString().split('T')[0];
//     }
//   }

//   goToEditPage() {
//     this.router.navigate(['/edit-profile'])
// =======
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
// >>>>>>> dfcd12356210f6d6f13b19515aee762d49cbff54
  }
}
