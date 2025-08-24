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

  toggleFavorite(event: Event) {
  event.stopPropagation();
  if (!this.currentUser || !this.flat?._id) return;

  const flatId = this.flat._id;
  const updatedFavorites = this.currentUser.favorites?.includes(flatId)
    ? this.currentUser.favorites.filter(id => id !== flatId)
    : [...(this.currentUser.favorites || []), flatId];

  this.userService.updateFavorites(this.currentUser._id!, updatedFavorites)
    .subscribe({
      next: (updatedUser: User) => {
        this.currentUser = updatedUser;
      },
      error: err => console.error(err)
    });
}

  goToEdit() {
    if (!this.flat?._id || this.flat.owner._id !== this.currentUser?._id) return;
    this.router.navigate(['/edit-flat', this.flat._id]);
  }
}
