import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Flat, FlatService } from '../../../services/flat.service';
import { map, Observable, of } from 'rxjs';
import { User, UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-flats',
  imports: [CommonModule],
  templateUrl: './my-flats.html',
  styleUrl: './my-flats.css',
})
export class MyFlats {
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
    this.router.navigate(['/flat-view', flat._id]);
  }

  editFlat(flat: any) {
    this.router.navigate(['/edit-flat', flat._id]);
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
    this.router.navigate(['/new-flat']);
  }
}
