import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Flat, FlatService } from '../../services/flat.service';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { User, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  isFilterOpen = false;
  currentUser: User | null = null;

  allFlatDB$!: Observable<Flat[]>;
  filteredItems$!: Observable<Flat[]>;

  // ✅ ngModel
  city: string = '';
  priceA: number | null = null;
  priceB: number | null = null;
  sizeA: number | null = null;
  sizeB: number | null = null;
  sort: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) this.currentUser = user;
    });

    // flats observable
    const flats$ = this.flatService.getFlats().pipe(
      catchError((err) => {
        console.error(err);
        return of([] as Flat[]);
      })
    );

    // filteredItems observable
    this.filteredItems$ = combineLatest([flats$, this.route.queryParams]).pipe(
      map(([flats, params]) => {
        let result = [...flats];

        const city = params['city'] || '';
        const priceA = params['priceA'] ? Number(params['priceA']) : null;
        const priceB = params['priceB'] ? Number(params['priceB']) : null;
        const sizeA = params['sizeA'] ? Number(params['sizeA']) : null;
        const sizeB = params['sizeB'] ? Number(params['sizeB']) : null;
        const sort = params['sort'] || '';

        // filtering
        result = result.filter((flat) => {
          const cityMatch =
            !city || flat.city.toLowerCase().includes(city.toLowerCase());
          const priceMatch =
            (priceA === null || flat.price >= priceA) &&
            (priceB === null || flat.price <= priceB);
          const sizeMatch =
            (sizeA === null || flat.size >= sizeA) &&
            (sizeB === null || flat.size <= sizeB);

          return cityMatch && priceMatch && sizeMatch;
        });

        // sorting
        const sortFuncs: Record<string, (a: Flat, b: Flat) => number> = {
          aToZ: (a, b) => a.city.localeCompare(b.city),
          zToA: (a, b) => b.city.localeCompare(a.city),
          priceLH: (a, b) => a.price - b.price,
          priceHL: (a, b) => b.price - a.price,
          sizeLH: (a, b) => a.size - b.size,
          sizeHL: (a, b) => b.size - a.size,
        };
        if (sortFuncs[sort]) result.sort(sortFuncs[sort]);

        return result;
      })
    );
  }

  trackById(index: number, item: Flat) {
    return item._id;
  }

  viewFlatDetail(flat: Flat) {
    if (!flat._id) return;
    window.location.href = `/flat/view/${flat._id}`;
  }

  // favorites
  getFavoriteIcon(flatId: string): string {
    const isMine = this.currentUser?.flats.some((flat) => flat._id === flatId);
    const isFavorite = this.currentUser?.favorites.some(
      (fav) => fav._id === flatId
    );

    if (isMine) {
      return '';
    } else {
      return isFavorite ? '/assets/fav-yellow.png' : '/assets/fav-white.png';
    }
  }
  setFavorite(flat: Flat) {
    const updatedFavorites = [...this.currentUser!.favorites];
    const index = updatedFavorites.findIndex((fav) => fav._id === flat._id);
    if (index >= 0) {
      updatedFavorites.splice(index, 1);
    } else {
      updatedFavorites.push(flat);
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

  filterReset() {
    this.city = '';
    this.priceA = null;
    this.priceB = null;
    this.sizeA = null;
    this.sizeB = null;
    this.sort = '';

    this.router.navigate([], { queryParams: {} });
  }

  filterApply() {
    this.router.navigate([], {
      queryParams: {
        city: this.city || null,
        priceA: this.priceA || null,
        priceB: this.priceB || null,
        sizeA: this.sizeA || null,
        sizeB: this.sizeB || null,
        sort: this.sort || null,
      },
    });
  }
}
