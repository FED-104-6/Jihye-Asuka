import { Component } from '@angular/core';
import { Flat, FlatService } from '../../../services/flat.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-flat-view',
  imports: [CommonModule],
  templateUrl: './flat-view.html',
  styleUrl: './flat-view.css',
})
export class FlatView {
  flat?: Flat;

  constructor(
    private route: ActivatedRoute,
    private flatService: FlatService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.flatService.getFlatById(id).subscribe({
        next: (data) => {
          this.flat = data;
        },
        error: (err) => console.error(err),
      });
    }
  }

  toggleFavorite() {
    // this.flat.isFavorite = !this.flat.isFavorite;
  }
}
