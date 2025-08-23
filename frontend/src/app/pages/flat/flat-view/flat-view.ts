import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FlatService, Flat } from '../../../services/flat.service';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-flat-view',
  imports: [CommonModule],
  templateUrl: './flat-view.html',
  styleUrl: './flat-view.css',
})
export class FlatView {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  flat?: Flat;
  flatId!: string;
  currentUser?: User| null = null;

  ngOnInit() {
    this.flatId = this.route.snapshot.paramMap.get('id')!;
    this.currentUser = this.authService.getUser(); 
    if (this.flatId) {
      this.flatService.getFlatById(this.flatId).subscribe(flat => {
        this.flat = flat;
      });
    }
  }

  toggleFavorite(user: User, flatId: string) {
    let updatedFavorites: string[];

    if (user.favorites?.includes(flatId)) {
      updatedFavorites = user.favorites.filter(id => id !== flatId);
    } else {
      updatedFavorites = [...(user.favorites || []), flatId];
    }

    this.userService.updateFavorites(user._id!, updatedFavorites).subscribe(updatedUser => {
      this.currentUser = updatedUser;
    });
  }
}
