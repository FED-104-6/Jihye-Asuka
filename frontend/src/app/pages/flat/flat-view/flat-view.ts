import { Component, ChangeDetectorRef } from '@angular/core';
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
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  flat?: Flat;
  flatId!: string;
  currentUser?: User | null = null;

  ngOnInit() {
    this.flatId = this.route.snapshot.paramMap.get('id')!;

    this.flatService.getFlatById(this.flatId).subscribe(flat => {
      this.flat = flat;

      this.userService.getUsers().subscribe(users => {
        const authUser = this.authService.getUser();

        if (!authUser) return;
        this.currentUser = users.find(u => u._id === authUser._id) || null;
        this.cdr.detectChanges();
      });
    });
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();

    if (!this.currentUser || !this.flat?._id) return;
    console.log('currentUser:', this.currentUser);
    console.log('flatId:', this.flat?._id);

    const flatId = this.flat._id;

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

  goToEdit() {
    if (!this.flat?._id || this.flat.owner._id !== this.currentUser?._id) return;
    this.router.navigate(['/edit-flat', this.flat._id]);
  }
}
