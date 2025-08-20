import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-favorites',
  imports: [CommonModule],
  templateUrl: './my-favorites.html',
  styleUrl: './my-favorites.css'
})
export class MyFavorites {
  favFlats = [
    {
      id: 1,
      address: '233 Robson St, Vancouver BC',
      size: '56m²',
      price: '$24,000 CAD',
      owner: 'Linda',
      ownerEmail: 'linda@gmail.com',
      image: '/assets/home.png',
      fav: true
    },
    {
      id: 2,
      address: '1200 W Georgia St, Vancouver BC',
      size: '72m²',
      price: '$38,000 CAD',
      owner: 'Tom',
      ownerEmail: 'tom@example.com',
      image: '/assets/home.png',
      fav: true
    }
  ];

  toggleFavorite() {
    //TODO: save or remove depend on the value
  }
}
