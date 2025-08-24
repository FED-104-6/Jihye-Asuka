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
  currentUser?: User | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser() as any;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const favoriteIds = this.currentUser.favorites || [];

    this.flatService.getFlats().subscribe(flats => {
      this.favFlats = flats.filter(flat => flat._id && favoriteIds.includes(flat._id));
    });
  }

  toggleFavorite(flat: Flat) {
    if (!this.currentUser || !flat._id) return;

    let updatedFavorites: string[];
    if (this.currentUser.favorites?.includes(flat._id)) {
      updatedFavorites = this.currentUser.favorites.filter(id => id !== flat._id);
    } else {
      updatedFavorites = [...(this.currentUser.favorites || []), flat._id];
    }

    this.userService.updateFavorites(this.currentUser._id!, updatedFavorites).subscribe(updatedUser => {
      this.currentUser = updatedUser;

      this.favFlats = this.favFlats.filter(f => updatedFavorites.includes(f._id!));
    });
  }

  goToFlatView(flat: Flat) {
    if (!flat._id) return;
    this.router.navigate(['/flat-view', flat._id]);
  }
}
