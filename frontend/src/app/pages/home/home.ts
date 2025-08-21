import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatService } from '../../services/flat.service';

interface Flat {
  id: number;
  city: string;
  stName: string;
  stNum: number;
  size: number;
  hasAC: boolean;
  year: number;
  price: number;
  availDate: Date;
  userid: number;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  allFlatDB: Flat[] = [];
  isLoggedIn = false;
  isFilterOpen = false;

  // filter
  city: string = '';
  priceA: number | null = null;
  priceB: number | null = null;
  sizeA: number | null = null;
  sizeB: number | null = null;
  sort: string = '';
  filteredItems: Flat[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService
  ) {}

  ngOnInit() {
    this.flatService.getFlats().subscribe({
      next: (data) => {
        this.allFlatDB = data;
        console.log(data);
        this.filteredItems = this.allFlatDB.map((flat) => ({
          ...flat,
        }));
      },
      error: (err) => console.error(err),
    });

    this.route.queryParams.subscribe((params) => {
      this.city = params['city'] || '';
      this.priceA = params['priceA'] ? Number(params['priceA']) : null;
      this.priceB = params['priceB'] ? Number(params['priceB']) : null;
      this.sizeA = params['sizeA'] ? Number(params['sizeA']) : null;
      this.sizeB = params['sizeB'] ? Number(params['sizeB']) : null;
      this.sort = params['sort'] || '';
    });
  }

  getAllFlats() {
    return this.filteredItems;
  }

  filterReset() {
    this.city = this.sort = '';
    this.priceA = this.priceB = null;
    this.sizeA = this.sizeB = null;
    this.filteredItems = [...this.allFlatDB];
    this.router.navigate([], { queryParams: {} });
  }
  filterApply() {
    // edit minus
    if (this.priceA !== null && this.priceA < 0) this.priceA = 0;
    if (this.priceB !== null && this.priceB < 0) this.priceB = 0;
    if (this.sizeA !== null && this.sizeA < 0) this.sizeA = 0;
    if (this.sizeB !== null && this.sizeB < 0) this.sizeB = 0;

    // filtering
    this.filteredItems = this.allFlatDB.filter((flat) => {
      const cityMatch =
        !this.city || flat.city.toLowerCase().includes(this.city.toLowerCase());
      const priceMatch =
        (this.priceA === null || flat.price >= this.priceA) &&
        (this.priceB === null || flat.price <= this.priceB);
      const sizeMatch =
        (this.sizeA === null || flat.size >= this.sizeA) &&
        (this.sizeB === null || flat.size <= this.sizeB);

      return cityMatch && priceMatch && sizeMatch;
    });

    // sort
    const sortFuncs: Record<string, (a: Flat, b: Flat) => number> = {
      aToZ: (a, b) => a.city.localeCompare(b.city),
      zToA: (a, b) => b.city.localeCompare(a.city),
      priceLH: (a, b) => a.price - b.price,
      priceHL: (a, b) => b.price - a.price,
      sizeLH: (a, b) => a.size - b.size,
      sizeHL: (a, b) => b.size - a.size,
    };

    if (sortFuncs[this.sort]) {
      this.filteredItems.sort(sortFuncs[this.sort]);
    }

    // url
    const params: any = {
      city: this.city,
      pmin: this.priceA,
      pmax: this.priceB,
      smin: this.sizeA,
      smax: this.sizeB,
      sort: this.sort,
    };
    Object.keys(params).forEach(
      (key) => (params[key] == null || params[key] === '') && delete params[key]
    );

    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
