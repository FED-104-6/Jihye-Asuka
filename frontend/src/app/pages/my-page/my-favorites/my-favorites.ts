import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Flat, FlatService } from '../../../services/flat.service';
import { map, Observable, of } from 'rxjs';
import { User, UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-favorites',
  imports: [CommonModule],
  templateUrl: './my-favorites.html',
  styleUrl: './my-favorites.css',
})
export class MyFavorites {
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  favFlats$!: Observable<Flat[]>;
  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = {
          ...user,
        };

        this.favFlats$ = of(this.currentUser.favorites ?? []);
      }
    });
  }

  viewFlatDetail(flat: Flat) {
    if (!flat._id) return;
    window.location.href =  `/flat/view/${flat._id}`;
  }

  // favorites
  removeFav(flat: Flat) {
    const updatedFavorites = [...this.currentUser!.favorites];
    const index = updatedFavorites.findIndex((fav) => fav._id === flat._id);
    if (index >= 0) {
      updatedFavorites.splice(index, 1);
    }

    this.userService
      .updateFavorites(this.currentUser!._id!, updatedFavorites)
      .subscribe({
        next: (updatedUser) => {
          this.authService.setUser(updatedUser);
          window.location.reload();
        },
        error: (err) => console.error(err),
      });
  }
}
