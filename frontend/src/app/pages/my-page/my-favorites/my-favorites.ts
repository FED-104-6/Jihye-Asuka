import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Flat, FlatService } from '../../../services/flat.service';
import { map, Observable, of } from 'rxjs';
import { User } from '../../../services/user.service';
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

        console.log(user.favorites);
        console.log(this.favFlats$);
      }
    });
  }

  viewFlatDetail(flat: Flat) {
    if (!flat._id) return;
    window.location.href =  `/flat-view/${flat._id}`;
  }

  removeFav(flat: Flat) {
    //TODO: save or remove depend on the value
  }
}
