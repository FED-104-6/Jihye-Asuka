import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatService, Flat } from '../../../services/flat.service';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-favorites',
  imports: [CommonModule],
  templateUrl: './my-favorites.html',
  styleUrl: './my-favorites.css'
})
export class MyFavorites {
  favFlats: Flat[] = [];
  flat?: Flat;
  flatId!: string;
  currentUser?: User | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const favoriteIds = this.currentUser.favorites || [];

    this.flatService.getFlats().subscribe(flats => {
      this.favFlats = flats.filter(flat => flat._id && favoriteIds.includes(flat._id));
    });
  }

  toggleFavorite(event: Event, flat: Flat) {
    event.stopPropagation();
    if (!this.currentUser || !flat?._id) return;
    console.log('currentUser:', this.currentUser);
    console.log('flatId:', flat?._id);

    const flatId = flat._id;
    if (this.currentUser.favorites?.includes(flatId)) {
      this.currentUser.favorites = this.currentUser.favorites.filter(id => id !== flatId);
    } else {
      this.currentUser.favorites = [...(this.currentUser.favorites || []), flatId];
    }
    console.log(this.currentUser.favorites)

    this.userService.updateFavorites(this.currentUser._id!, this.currentUser.favorites)
      .subscribe({
        next: (res: any) => {
          this.currentUser = res.user;;
        },
        error: err => console.error(err)
      });
  }

  goToFlatView(flat: Flat) {
    if (!flat._id) return;
    this.router.navigate(['/flat-view', flat._id]);
  }
}
