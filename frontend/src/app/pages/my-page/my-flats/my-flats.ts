// <<<<<<< HEAD
// import { Component, ChangeDetectorRef } from '@angular/core';
// import { DatePipe } from '@angular/common';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FlatService, Flat } from '../../../services/flat.service';
// import { UserService } from '../../../services/user.service';
// =======
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Flat, FlatService } from '../../../services/flat.service';
import { map, Observable, of } from 'rxjs';
import { User, UserService } from '../../../services/user.service';
// >>>>>>> dfcd12356210f6d6f13b19515aee762d49cbff54
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-flats',
  imports: [CommonModule],
  templateUrl: './my-flats.html',
  styleUrl: './my-flats.css',
})
export class MyFlats {
// <<<<<<< HEAD
//   myFlats: Flat[] = [];

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private flatService: FlatService,
//     private userService: UserService,
//     private authService: AuthService,
//     private cdr: ChangeDetectorRef
//   ) { }

//   ngOnInit() {
//     const currentUser = this.authService.getUser() as any;

//     if (!currentUser) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     const userId = currentUser._id;

//     this.flatService.getFlats().subscribe(flats => {
//       this.myFlats = flats.filter(flat => flat.owner && flat.owner._id === userId);
//       this.cdr.detectChanges();
//     });
//   }

//   goToFlatView(flat: Flat) {
//     if (!flat._id) return;
//     this.router.navigate(['/flat-view', flat._id]);
//   }

//   goToFlatEdit(flat: Flat, event?: Event) {
//     event?.stopPropagation();

//     if (!flat._id) return;
//     this.router.navigate(['/edit-flat', flat._id]);
//   }

//   onDelete(flat: Flat, event?: Event) {
//     event?.stopPropagation();

//     if (!confirm('Are you sure you want to delete this flat?')) return;

//     this.flatService.deleteFlat(flat._id!).subscribe({
//       next: () => {
//         this.myFlats = this.myFlats.filter(f => f._id !== flat._id);
//       },
//       error: err => console.error(err)
//     });
//   }

//   goToAddFlat() {
//     this.router.navigate(['/new-flat']);
// =======
  constructor(
    private router: Router,
    private authService: AuthService,
    private flatService: FlatService
  ) {}

  myFlats$!: Observable<Flat[]>;
  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = {
          ...user,
          flats: user.flats?.map((f: any) => ({
            ...f,
            availDate: new Date(f.availDate),
          })),
        };

        this.myFlats$ = of(this.currentUser.flats ?? []);
      }
    });
  }

  trackById(index: number, item: Flat) {
    return item._id;
  }

  viewFlatDetail(flat: Flat) {
    if (!flat._id) return;
    window.location.href =  `/flat/view/${flat._id}`;
  }

  editFlat(flat: any) {
    window.location.href =  `/flat/edit/${flat._id}`;
  }
  removeFlat(flat: any) {
    if (!flat._id) return;
    if (!confirm('Are you sure?')) return;

    this.flatService.deleteFlat(flat._id).subscribe({
      next: (res) => {
        console.log(res.message);
        window.location.reload();
      },
      error: (err) => console.error(err),
    });
  }
  addFlat() {
    window.location.href = '/flat/create';
// >>>>>>> dfcd12356210f6d6f13b19515aee762d49cbff54
  }
}
