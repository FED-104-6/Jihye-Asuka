import { Component, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatService, Flat } from '../../../services/flat.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-flats',
  imports: [DatePipe, CommonModule],
  templateUrl: './my-flats.html',
  styleUrl: './my-flats.css'
})
export class MyFlats {
  myFlats: Flat[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getUser() as any;

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = currentUser._id;

    this.flatService.getFlats().subscribe(flats => {
      this.myFlats = flats.filter(flat => flat.owner && flat.owner._id === userId);
      this.cdr.detectChanges();
    });
  }

  goToFlatView(flat: Flat) {
    if (!flat._id) return;
    this.router.navigate(['/flat-view', flat._id]);
  }

  goToFlatEdit(flat: Flat, event?: Event) {
    event?.stopPropagation();

    if (!flat._id) return;
    this.router.navigate(['/edit-flat', flat._id]);
  }

  onDelete(flat: Flat, event?: Event) {
    event?.stopPropagation();

    if (!confirm('Are you sure you want to delete this flat?')) return;

    this.flatService.deleteFlat(flat._id!).subscribe({
      next: () => {
        this.myFlats = this.myFlats.filter(f => f._id !== flat._id);
      },
      error: err => console.error(err)
    });
  }

  goToAddFlat() {
    this.router.navigate(['/new-flat']);
  }
}
